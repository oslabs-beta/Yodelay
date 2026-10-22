const http = require("http");
const express = require("express");
const grpc = require("@grpc/grpc-js");
const { WebSocketServer } = require("ws");
const { randomUUID } = require("crypto");
const { loadProtoFiles, findService } = require("./parseProto");

const sessions = new Map();

function elapsedMs(started) {
  const diff = process.hrtime(started);
  return Math.round((diff[0] * 1000 + diff[1] / 1e6) * 100) / 100;
}

function send(ws, frame) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(frame));
  }
}

function credentialsFor(tls) {
  if (!tls || !tls.enabled) return grpc.credentials.createInsecure();
  const root = tls.caPem ? Buffer.from(tls.caPem) : null;
  const key = tls.keyPem ? Buffer.from(tls.keyPem) : null;
  const cert = tls.certPem ? Buffer.from(tls.certPem) : null;
  return grpc.credentials.createSsl(root, key, cert);
}

function metadataFor(rows) {
  const metadata = new grpc.Metadata();
  for (const row of rows || []) {
    if (row && row.key) metadata.set(String(row.key), String(row.value ?? ""));
  }
  return metadata;
}

function callOptions(message) {
  const timeout = Number(message.timeoutMs);
  if (!timeout) return {};
  return { deadline: new Date(Date.now() + timeout) };
}

function channelOptions(tls) {
  if (tls && tls.enabled && tls.serverName) {
    return { "grpc.ssl_target_name_override": tls.serverName };
  }
  return {};
}

function attachCall(ws, client, call, streamType, started) {
  let settled = false;
  const finish = (statusMessage, errorMessage) => {
    if (settled) return;
    settled = true;
    const elapsed = elapsedMs(started);
    if (errorMessage) {
      send(ws, { type: "error", message: errorMessage, elapsedMs: elapsed });
    }
    send(ws, { type: "status", message: statusMessage, elapsedMs: elapsed });
    ws.active = null;
    try {
      client.close();
    } catch (err) {
      /* the channel may already be closed */
    }
  };
  ws.active = { call, streamType, client, finish };
  return finish;
}

function onStart(ws, message) {
  if (ws.active) {
    send(ws, { type: "error", message: "a call is already active", elapsedMs: 0 });
    return;
  }
  const session = sessions.get(message.sessionId);
  if (!session) {
    send(ws, { type: "error", message: "upload a proto file first", elapsedMs: 0 });
    send(ws, { type: "status", message: "upload a proto file first", elapsedMs: 0 });
    return;
  }
  let body = {};
  if (message.body) {
    try {
      body = JSON.parse(message.body);
    } catch (err) {
      send(ws, { type: "error", message: "request body is not valid JSON", elapsedMs: 0 });
      send(ws, { type: "status", message: "request body is not valid JSON", elapsedMs: 0 });
      return;
    }
  }
  const Service = findService(session.root, message.service);
  if (!Service || !Service.service || !Service.service[message.method]) {
    send(ws, { type: "error", message: "unknown service or method", elapsedMs: 0 });
    send(ws, { type: "status", message: "unknown service or method", elapsedMs: 0 });
    return;
  }
  const started = process.hrtime();
  let client;
  try {
    client = new Service(message.url, credentialsFor(message.tls), channelOptions(message.tls));
  } catch (err) {
    send(ws, { type: "error", message: err.message, elapsedMs: 0 });
    send(ws, { type: "status", message: err.message, elapsedMs: 0 });
    return;
  }
  const metadata = metadataFor(message.metadata);
  const options = callOptions(message);
  const method = message.method;

  try {
    if (message.streamType === "unary") {
      const finish = attachCall(ws, client, null, "unary", started);
      client[method](body, metadata, options, (err, response) => {
        if (err) {
          finish(err.details || err.message, err.details || err.message);
          return;
        }
        send(ws, { type: "data", message: JSON.stringify(response), elapsedMs: elapsedMs(started) });
        finish("OK");
      });
      return;
    }
    if (message.streamType === "serverStreaming") {
      const call = client[method](body, metadata, options);
      const finish = attachCall(ws, client, call, "serverStreaming", started);
      call.on("data", (response) => {
        send(ws, { type: "data", message: JSON.stringify(response), elapsedMs: elapsedMs(started) });
      });
      call.on("end", () => finish("OK"));
      call.on("error", (err) => {
        if (err.code === grpc.status.CANCELLED) finish("cancelled");
        else finish(err.details || err.message, err.details || err.message);
      });
      return;
    }
    if (message.streamType === "clientStreaming") {
      const call = client[method](metadata, options, (err, response) => {
        if (err) {
          ws.active && ws.active.finish(err.details || err.message, err.details || err.message);
          return;
        }
        send(ws, { type: "data", message: JSON.stringify(response), elapsedMs: elapsedMs(started) });
        ws.active && ws.active.finish("OK");
      });
      attachCall(ws, client, call, "clientStreaming", started);
      call.write(body);
      call.on("error", (err) => {
        ws.active && ws.active.finish(err.details || err.message, err.details || err.message);
      });
      return;
    }
    if (message.streamType === "bidiStreaming") {
      const call = client[method](metadata, options);
      const finish = attachCall(ws, client, call, "bidiStreaming", started);
      call.write(body);
      call.on("data", (response) => {
        send(ws, { type: "data", message: JSON.stringify(response), elapsedMs: elapsedMs(started) });
      });
      call.on("end", () => finish("OK"));
      call.on("error", (err) => {
        if (err.code === grpc.status.CANCELLED) finish("cancelled");
        else finish(err.details || err.message, err.details || err.message);
      });
      return;
    }
    client.close();
    send(ws, { type: "error", message: "unknown stream type", elapsedMs: 0 });
    send(ws, { type: "status", message: "unknown stream type", elapsedMs: 0 });
  } catch (err) {
    try {
      client.close();
    } catch (closeErr) {
      /* ignore */
    }
    ws.active = null;
    send(ws, { type: "error", message: err.message, elapsedMs: elapsedMs(started) });
    send(ws, { type: "status", message: err.message, elapsedMs: elapsedMs(started) });
  }
}

function requireCall(ws) {
  if (ws.active && ws.active.call) return ws.active;
  send(ws, { type: "error", message: "no active call", elapsedMs: 0 });
  return null;
}

function onSocketMessage(ws, raw) {
  let message;
  try {
    message = JSON.parse(raw.toString());
  } catch (err) {
    send(ws, { type: "error", message: "message is not valid JSON", elapsedMs: 0 });
    return;
  }
  if (message.type === "start") {
    onStart(ws, message);
    return;
  }
  if (message.type === "send") {
    const active = requireCall(ws);
    if (!active) return;
    try {
      active.call.write(JSON.parse(message.body || "{}"));
    } catch (err) {
      send(ws, { type: "error", message: err.message, elapsedMs: 0 });
    }
    return;
  }
  if (message.type === "end") {
    const active = requireCall(ws);
    if (!active) return;
    if (active.streamType === "serverStreaming") active.call.cancel();
    else active.call.end();
    return;
  }
  if (message.type === "cancel") {
    const active = requireCall(ws);
    if (!active) return;
    active.call.cancel();
    return;
  }
  send(ws, { type: "error", message: "unknown command", elapsedMs: 0 });
}

function createApp() {
  const app = express();
  app.use(express.json({ limit: "4mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });
  app.post("/api/session", (req, res) => {
    try {
      const loaded = loadProtoFiles(req.body.files, req.body.entry);
      const sessionId = randomUUID();
      sessions.set(sessionId, loaded);
      res.json({ sessionId, services: loaded.services });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  return app;
}

function startProxy(port = 4000) {
  const app = createApp();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    ws.active = null;
    ws.on("message", (raw) => {
      try {
        onSocketMessage(ws, raw);
      } catch (err) {
        send(ws, { type: "error", message: err.message, elapsedMs: 0 });
      }
    });
    ws.on("close", () => {
      if (ws.active && ws.active.call) {
        try {
          ws.active.call.cancel();
        } catch (err) {
          /* the call may already be finished */
        }
      }
    });
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        port: address.port,
        close() {
          for (const session of sessions.values()) session.cleanup();
          sessions.clear();
          wss.close();
          return new Promise((done) => server.close(() => done()));
        }
      });
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4000);
  startProxy(port).then(({ port: bound }) => {
    console.log(`proxy listening on 127.0.0.1:${bound}`);
  });
}

module.exports = { startProxy, createApp };

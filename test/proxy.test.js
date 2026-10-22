const test = require("node:test");
const assert = require("node:assert/strict");
const { WebSocket } = require("ws");
const { startProxy } = require("../server_client/server_client");

function once(emitter, event) {
  return new Promise((resolve, reject) => {
    emitter.once(event, resolve);
    emitter.once("error", reject);
  });
}

test("cancel with no active call returns an error and leaves the proxy up", async () => {
  const proxy = await startProxy(0);
  const socket = new WebSocket(`ws://127.0.0.1:${proxy.port}/ws`);
  try {
    await once(socket, "open");
    const framePromise = once(socket, "message");
    socket.send(JSON.stringify({ type: "cancel" }));
    const raw = await framePromise;
    const frame = JSON.parse(raw.toString());
    assert.equal(frame.type, "error");
    assert.match(frame.message, /no active call/);

    const health = await fetch(`http://127.0.0.1:${proxy.port}/api/health`);
    assert.equal(health.status, 200);
    const body = await health.json();
    assert.equal(body.ok, true);
  } finally {
    socket.close();
    await proxy.close();
  }
});

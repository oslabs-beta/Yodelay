const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { startDemo } = require("../grpc_server/demo");

function makeClient(port) {
  const definition = protoLoader.loadSync(path.join(__dirname, "../protos/demo.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const demo = grpc.loadPackageDefinition(definition).demo;
  return new demo.itIsDemoTimeYodelay(`127.0.0.1:${port}`, grpc.credentials.createInsecure());
}

function unary(client, method, body) {
  return new Promise((resolve, reject) => {
    client[method](body, { deadline: new Date(Date.now() + 4000) }, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

test("unary YodelayWorld and toLowerCase answer", async () => {
  const demo = await startDemo(0);
  const client = makeClient(demo.port);
  try {
    const yodel = await unary(client, "YodelayWorld", { whenI: "yodel" });
    assert.match(yodel.message, /yodel/);
    const lower = await unary(client, "toLowerCase", { uppercase: "YODELAY" });
    assert.match(lower.message, /yodelay/);
  } finally {
    client.close();
    await demo.stop();
  }
});

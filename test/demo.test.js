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

function serverStream(client) {
  return new Promise((resolve, reject) => {
    const messages = [];
    const call = client.GreetManyTimes(
      { greeting: { first_name: "Ada", last_name: "Lovelace" } },
      { deadline: new Date(Date.now() + 4000) }
    );
    call.on("data", (message) => messages.push(message));
    call.on("end", () => resolve(messages));
    call.on("error", reject);
  });
}

function clientStream(client) {
  return new Promise((resolve, reject) => {
    const call = client.LongGreet({ deadline: new Date(Date.now() + 4000) }, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
    call.write({ greet: { first_name: "Ada", last_name: "One" } });
    call.write({ greet: { first_name: "Grace", last_name: "Two" } });
    call.end();
  });
}

function bidi(client) {
  return new Promise((resolve, reject) => {
    const messages = [];
    const call = client.GreetEveryone({ deadline: new Date(Date.now() + 4000) });
    call.on("data", (message) => messages.push(message));
    call.on("end", () => resolve(messages));
    call.on("error", reject);
    call.write({ greet: { first_name: "Ada", last_name: "Lovelace" } });
    call.end();
  });
}

test("demo server implements every call shape and stays up", async () => {
  const demo = await startDemo(0);
  const client = makeClient(demo.port);
  try {
    const yodel = await unary(client, "YodelayWorld", { whenI: "yodel" });
    assert.match(yodel.message, /yodel/);

    const lower = await unary(client, "toLowerCase", { uppercase: "YODELAY" });
    assert.match(lower.message, /yodelay/);

    const greet = await unary(client, "Greet", {
      greeting: { first_name: "Ada", last_name: "Lovelace" }
    });
    assert.equal(greet.result, "Hello Ada Lovelace");

    const many = await serverStream(client);
    assert.equal(many.length, 10);
    assert.ok(many.every((message) => message.result === "Ada"));

    const long = await clientStream(client);
    assert.equal(long.result, "You Yodeled 2 of times!");

    const echoed = await bidi(client);
    assert.deepEqual(echoed, [{ result: "Hello Ada Lovelace" }]);

    const stillUp = await unary(client, "YodelayWorld", { whenI: "again" });
    assert.match(stillUp.message, /again/);
  } finally {
    client.close();
    await demo.stop();
  }
});

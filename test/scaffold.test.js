const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { loadProtoFiles } = require("../server_client/parseProto");
const { scaffoldMessage } = require("../shared/scaffold");

test("scaffold emits JSON for scalar and nested requests", () => {
  const contents = fs.readFileSync(path.join(__dirname, "../protos/demo.proto"), "utf8");
  const loaded = loadProtoFiles([{ name: "demo.proto", contents }], "demo.proto");
  try {
    const service = loaded.services.find((item) => item.name === "itIsDemoTimeYodelay");
    const yodel = service.methods.find((method) => method.name === "YodelayWorld");
    const yodelBody = JSON.parse(scaffoldMessage(yodel.request.fields));
    assert.deepEqual(yodelBody, { whenI: "Hello" });

    const greet = service.methods.find((method) => method.name === "GreetManyTimes");
    const greetBody = JSON.parse(scaffoldMessage(greet.request.fields));
    assert.deepEqual(greetBody, {
      greeting: { first_name: "Hello", last_name: "Hello" }
    });
  } finally {
    loaded.cleanup();
  }
});

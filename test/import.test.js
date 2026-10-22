const test = require("node:test");
const assert = require("node:assert/strict");
const { loadProtoFiles } = require("../server_client/parseProto");

const entry = `syntax = "proto3";
import "inner.proto";
package demoimport;
service ImportedService {
  rpc UseInner (Outer) returns (Outer);
}
message Outer {
  Inner inner = 1;
}
`;

const inner = `syntax = "proto3";
package demoimport;
message Inner {
  string name = 1;
}
`;

test("a well-known google protobuf import resolves", () => {
  const proto = `syntax = "proto3";
import "google/protobuf/timestamp.proto";
package demots;
service Clock {
  rpc Now (google.protobuf.Timestamp) returns (google.protobuf.Timestamp);
}
`;
  const loaded = loadProtoFiles([{ name: "clock.proto", contents: proto }], "clock.proto");
  try {
    const method = loaded.services[0].methods[0];
    const names = method.request.fields.map((field) => field.name);
    assert.ok(names.includes("seconds"));
    assert.ok(names.includes("nanos"));
  } finally {
    loaded.cleanup();
  }
});

test("an imported message is part of the request tree", () => {
  const loaded = loadProtoFiles(
    [
      { name: "entry.proto", contents: entry },
      { name: "inner.proto", contents: inner }
    ],
    "entry.proto"
  );
  try {
    const method = loaded.services[0].methods[0];
    const innerField = method.request.fields[0];
    assert.equal(innerField.name, "inner");
    assert.equal(innerField.type, "TYPE_MESSAGE");
    assert.equal(innerField.fields[0].name, "name");
    assert.equal(innerField.fields[0].type, "TYPE_STRING");
  } finally {
    loaded.cleanup();
  }
});

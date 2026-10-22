const fs = require("fs");
const os = require("os");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const LOADER_OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

function loadProtoFiles(files, entryName) {
  if (!files || files.length === 0) {
    throw new Error("Upload at least one .proto file");
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yodelay-"));
  try {
  for (const file of files) {
    const safeName = path.basename(file.name);
    if (!safeName || safeName === "." || safeName === "..") {
      throw new Error("Invalid proto file name");
    }
    fs.writeFileSync(path.join(dir, safeName), file.contents, "utf8");
  }
  const entry = path.basename(entryName || files[0].name);
  const packageDefinition = protoLoader.loadSync(path.join(dir, entry), {
    ...LOADER_OPTIONS,
    includeDirs: [dir]
  });
  return {
    dir,
    packageDefinition,
    root: grpc.loadPackageDefinition(packageDefinition),
    services: describeServices(packageDefinition),
    cleanup() {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
  } catch (err) {
    fs.rmSync(dir, { recursive: true, force: true });
    throw err;
  }
}

function describeServices(packageDefinition) {
  const services = [];
  for (const [fullName, def] of Object.entries(packageDefinition)) {
    if (!isServiceDefinition(def)) continue;
    const serviceName = fullName.split(".").pop();
    const methods = [];
    for (const [methodName, method] of Object.entries(def)) {
      const requestType = method.requestType && method.requestType.type;
      methods.push({
        name: methodName,
        streamType: streamType(method),
        request: {
          name: (requestType && requestType.name) || methodName,
          fields: requestType ? describeFields(packageDefinition, requestType.field || []) : []
        }
      });
    }
    services.push({ name: serviceName, methods });
  }
  return services;
}

function isServiceDefinition(def) {
  if (!def || typeof def !== "object" || def.format) return false;
  return Object.values(def).some((method) => method && method.path && method.requestType);
}

function streamType(method) {
  if (method.requestStream && method.responseStream) return "bidiStreaming";
  if (method.requestStream) return "clientStreaming";
  if (method.responseStream) return "serverStreaming";
  return "unary";
}

function describeFields(packageDefinition, fields) {
  return fields.map((field) => {
    const repeated = field.label === "LABEL_REPEATED";
    if (field.type === "TYPE_MESSAGE" && field.typeName) {
      const message = lookupType(packageDefinition, field.typeName);
      return {
        name: field.name,
        type: "TYPE_MESSAGE",
        typeName: field.typeName,
        repeated,
        fields: message ? describeFields(packageDefinition, message.field || []) : []
      };
    }
    if (field.type === "TYPE_ENUM" && field.typeName) {
      return {
        name: field.name,
        type: "TYPE_ENUM",
        typeName: field.typeName,
        repeated,
        enumValues: lookupEnumValues(packageDefinition, field.typeName)
      };
    }
    return {
      name: field.name,
      type: field.type,
      repeated
    };
  });
}

function lookupType(packageDefinition, typeName) {
  const suffix = typeName.replace(/^\./, "");
  const entry = Object.entries(packageDefinition).find(([key, value]) => {
    return value && value.type && (key === suffix || key.endsWith(`.${suffix.split(".").pop()}`));
  });
  return entry ? entry[1].type : null;
}

function lookupEnumValues(packageDefinition, typeName) {
  const suffix = typeName.replace(/^\./, "").split(".").pop();
  for (const value of Object.values(packageDefinition)) {
    const enums = value && value.type && value.type.enumType;
    if (!enums) continue;
    const found = enums.find((item) => item.name === suffix);
    if (found && found.value) {
      return found.value.map((enumValue) => enumValue.name);
    }
  }
  return [];
}

function findService(root, name) {
  const stack = [root];
  const seen = new Set();
  while (stack.length) {
    const node = stack.pop();
    if (!node || seen.has(node)) continue;
    seen.add(node);
    if (typeof node !== "object" && typeof node !== "function") continue;
    for (const [key, value] of Object.entries(node)) {
      if (key === "service") continue;
      if (typeof value === "function" && value.service && key === name) return value;
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return null;
}

module.exports = {
  loadProtoFiles,
  describeServices,
  findService
};

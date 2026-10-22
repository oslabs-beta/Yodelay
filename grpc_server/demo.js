const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/demo.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const demo = grpc.loadPackageDefinition(packageDefinition).demo;

function yodelayWorld(call, callback) {
  const whenI = call.request.whenI || "";
  callback(null, {
    message: `When I yodel ${whenI} -->  you yodel IiiOoo!!!! YODELAY!!! --> ________________`
  });
}

function toLowerCase(call, callback) {
  const value = call.request.uppercase || "";
  callback(null, {
    message: `When you input this uppercase string: ${value} the gRPC server runs the function and responds with this output: ${value.toLowerCase()} <--`
  });
}

function startDemo(port = 0, host = "127.0.0.1") {
  const server = new grpc.Server();
  server.addService(demo.itIsDemoTimeYodelay.service, {
    YodelayWorld: yodelayWorld,
    toLowerCase
  });
  return new Promise((resolve, reject) => {
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, bound) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        port: bound,
        stop() {
          return new Promise((done) => server.tryShutdown(() => done()));
        }
      });
    });
  });
}

if (require.main === module) {
  const port = process.env.PORT || 8080;
  startDemo(port, "0.0.0.0").then(({ port: bound }) => {
    console.log(`demo gRPC listening on ${bound}`);
  });
}

module.exports = { startDemo };

// this is our test grpc server:
let PROTO_PATH = __dirname + '/../protos/helloworld.proto';
const port = '0.0.0.0:50051';
let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

//

const packageName = 'helloaworld'

let hello_proto = grpc.loadPackageDefinition(packageDefinition)[packageName];

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  console.log('------------')
  console.log(`Hi! I'm the gRPC server`)
  callback(null, {message: 'Hello ' + call.request.name});
  // console.log('after grpc server')
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  let server = new grpc.Server();
  server.addService(hello_proto.YodelayAPI.service, 
    { sayHello });
  server.bind(port, grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

console.log(`gRPC💥 'n on port: ${port}`)
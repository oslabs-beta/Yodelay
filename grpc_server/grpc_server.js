let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

// this is our test grpc server:
let PROTO_PATH = __dirname + '/../protos/helloworld.proto';
// const port = '0.0.0.0:50051';

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
let port;

function sayHello(call, callback) {
  console.log('------------')
  console.log(`Hi! I'm the gRPC server`)
  // items coning in from the express server:
  console.log(call.request)
  port = call.request.port;
  let packageName = call.request.packageName;
  let service = call.request.service;
  let message = call.request.message;
  let protoObject = call.request.protoObject;


  callback(null, {message: 'Hello ' + packageName + `! This was a call to port ${port} requesting the ${service} in ${protoObject} with the message of: ${message}`});
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
    console.log(port);
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

console.log(`gRPC💥 'n on port: ${port}`)
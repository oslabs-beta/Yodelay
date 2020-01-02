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
let url;

function sayHello(call, callback) {
  console.log('------rpc function call------')
  console.log(`Hi! I'm the gRPC server`)
  // items coning in from the express server:
  console.log('gRPC incoming call request: ', call.request)
  url = call.request.url;
  let package = call.request.package;
  let serviceInput = call.request.serviceInput;
  let requestInput = call.request.requestInput;
  let messageInput = call.request.messageInput;
  let protoFile = call.request.protoFile;
  let protoDescriptor = call.request.protoDescriptor;
  
  
  // callback(null, {message: 'Hello ' + package + `! This was a call to port ${url} requesting the ${serviceInput} in ${protoFile} with the message of: ${messageInput}`});
  callback(null, {
    message: `This was a call to ${url} using the ${packageName} package with the ${serviceInput} that contains the ${requestInput} method with the message of: ${messageInput}. We were able to get this from parsing ${protoFile} with the built in ${protoDescriptor}.`
  });
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
    console.log('grpc main url: ', url);
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

console.log(`gRPC💥 'n on port: 0.0.0.0:50051 (${url})`)
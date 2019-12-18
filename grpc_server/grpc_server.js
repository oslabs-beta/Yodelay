var PROTO_PATH = __dirname + '/../protos/helloworld.proto';
const port = '0.0.0.0:50051';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  console.log('------------')
  console.log('grpc server')
  callback(null, {message: 'Hello ' + call.request.name});
  console.log('after grpc server')
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, 
    {sayHello});
  server.bind(port, grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

console.log(`gRPC💥 ing on port: ${port}`)
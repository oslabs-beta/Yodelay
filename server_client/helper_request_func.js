const PROTO_PATH = __dirname + '/../protos/helloworld.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function grpcRequest() {
  const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  
  grpc_promise.promisifyAll(client);

  let output;

  return client.sayHello()
    .sendMessage({name: "Goes"})
    .then( res => {
      console.log('Greeting: ', res)
      output = res;
      console.log(output)
      return output
    })
    .catch(err => console.error(err))
}

module.exports = grpcRequest;
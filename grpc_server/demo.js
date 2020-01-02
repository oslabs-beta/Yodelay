let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

// this is our test grpc server:
let PROTO_PATH = __dirname + '/../protos/demo.proto';

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const packageName = 'demo'

let demo_proto = grpc.loadPackageDefinition(packageDefinition)[packageName];

// console.log(demo_proto)


// first demo function:
function YodelayWorld(call, callback) {
  console.log('call: ', call)
  const whenI = call.request.whenI;  
  callback(null, {
    message: `When I yodel ${whenI} -->  you yodel IiiOoo!!!! YODELAY!!! --> ________________`
  });
}

// second demo:
function toLowerCase(call, callback) {
  // console.log(call.request)
  const value = call.request.uppercase 
  const lower = value.toLowerCase();
  callback(null, {
    message: `When you input this uppercase string: ${value} the gRPC server runs the function and responds with this output: ${lower} <--`
  });
};
  


// run innerRps function n times
function gRPCPermutations (call , callback) {
  
  let n = call.request.n;
  
  let arr = [''];
  while (n > 0) {
    arr = innerGRPC(arr);
    n -= 1;
  }
  console.log(arr)
  const str = JSON.stringify(arr);
  console.log(str)
  callback(null, {
    message: str
  });

  function innerGRPC (arr) {
  const g = arr.map(letter => `g${letter}`);
  const r = arr.map(letter => `R${letter}`);
  const p = arr.map(letter => `P${letter}`);
  const c = arr.map(letter => `C${letter}`);
  return [...g, ...r, ...p, ...c];
};

};

  

function main() {
  let server = new grpc.Server();
  server.addService(demo_proto.itIsDemoTimeYodelay.service, 
    { 
      YodelayWorld, 
      toLowerCase,
      gRPCPermutations
    });
  server.bind('0.0.0.0:8080', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

console.log(`gRPC💥 'n on port: 0.0.0.0:8080`)
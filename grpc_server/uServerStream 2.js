const fs = require("fs");
const grpc = require("grpc");
const protoLoader = require('@grpc/proto-loader');


let PROTO_PATH = __dirname + '/../protos/uGreet.proto';

let packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const packageName = 'greet'

let greets = grpc.loadPackageDefinition(packageDefinition)[packageName];


function greetManyTimes(call, callback) {
  let firstName = call.request.getGreeting().getFirstName();

  let count = 0,
    intervalID = setInterval(function () {
      let greetManyTimesResponse = new greets.GreetManyTimesResponse();
      greetManyTimesResponse.setResult(firstName);

      // setup streaming
      call.write(greetManyTimesResponse);
      if (++count > 9) {
        clearInterval(intervalID);
        call.end(); // we have sent all messages!
      }
    }, 1000);
}


function main() {
  // let credentials = grpc.ServerCredentials.createSsl(
  //   fs.readFileSync("../certs/ca.crt"),
  //   [
  //     {
  //       cert_chain: fs.readFileSync("../certs/server.crt"),
  //       private_key: fs.readFileSync("../certs/server.key")
  //     }
  //   ],
  //   true
  // );

  let server = new grpc.Server();


  server.addService(greets.service, {
    greetManyTimes: greetManyTimes,
  });
  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
  server.start();

  console.log("Server running on port 127.0.0.1:50051");
}

main();
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

// this package name came from uGreet.proto file
const packageName = 'greet'

// greets is descriptor package
let greets = grpc.loadPackageDefinition(packageDefinition)[packageName];

function callGreetManyTimes() {
  // Created our server client

  //
  const client = new greets(
    'localhost:50051',
    grpc.credentials.createInsecure()
  )
  

  // create request

  var request = new greets.GreetManyTimesRequest();

  var greeting = new greets.Greeting();
  greeting.setFirstName("Paulo");
  greeting.setLastName("Dichone");

  request.setGreeting(greeting);

  var call = client.greetManyTimes(request, () => {});

  call.on("data", response => {
    console.log("Client Streaming Response: ", response.getResult());
  });

  call.on("status", status => {
    console.log(status.details);
  });

  call.on("error", error => {
    console.error(error.details);
  });

  call.on("end", () => {
    console.log("Streaming Ended!");
  });
}


function main(){
  callGreetManyTimes();
}

main ()
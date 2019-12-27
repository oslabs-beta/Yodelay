const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');
const fs = require('fs');

// We have two helper functions, parseProto and grpcRequest
// parseProto takes the incoming proto string, writes it to a file
// MESSAGE FIELDS:
let port;
let packageName;
let service;
let message;
let protoObject;
let output;


// input
// output: {protoFile: “the text of the photo file”, services: [{}, {}, {}], protoDescription: {}}

async function parseProto(upload) {
// MESSAGE FIELDS:
console.log('-----Start Parsing Proto-----')

// console.log('upload: ', upload)
// port = upload.port;
// console.log('port: ', port)
// packageName = upload.packageName;
// service = upload.service;
// message = upload.message;

// the proto object is where we are passed in the .proto file from the server_client
// we then take this object and write it to the temp output.proto file in the proto folder:
// console.log('proto obj: ', protoObject)
// protoObject = upload.protoObject;

// test from initial front end:
protoObject = upload;
// 

let output = {};

output.protoFile = protoObject;
// console.log(output)


// WRITE TO TEMP .PROTO
  // now let's write our protoObject string to the output.proto file:
fs.writeFileSync("./protos/output.proto", protoObject, 'utf8', function (err) {
  if (err) {
    console.log("An error occurred while writing JSON Object to File.");
    return console.log(err);
  }
  console.log("JSON file has been saved.");
});

// BUILD DEFINITION AND DESCRIPTOR:
// now we have a path for our proto:
const PROTO_PATH = __dirname + '/../protos/output.proto';

// and a config object:
const CONFIG_OBJECT = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

// now that the file is written we want to create our package definition:
const packageDefinition = protoLoader.loadSync(PROTO_PATH, CONFIG_OBJECT);

// this is how you grab the .proto file package name:
let protoPackageName = await Object.keys(packageDefinition)[0].split('.')[0]
// console.log('p: ', p)

// console.log('package: ', typeof(Object.keys(packageDefinition)[0].split('.')[0]))
// console.log(packageName)

output.package = protoPackageName;

//  this gives us the proto package name as well as any service names:
let services = []
output.services = services

for (let property in packageDefinition) {
  // console.log(property)
  services.push(property)
}
// console.log('output: ', output)
output.definition = packageDefinition;

// let's use the package definintion to create our descriptor:
const descriptor = grpc.loadPackageDefinition(packageDefinition)[protoPackageName];
console.log('descriptor: ', descriptor)
// this gets us the message name form the proto file:
// console.log('des new: ', descriptor.HelloRequest.type.field[0].name);
// console.log('des new: ', descriptor.HelloRequest.type);

output.protoDescription = descriptor;

console.log('-----done parsing proto-----')
return output;
}



// input is this object: 
// {
//     "port": "0.0.0.0:50051",
//     "packageName": "helloaworld",
//     "service": "YodelayAPI",
//     "message": "SayHello",
//     "protoObject": "syntax = 'proto3'; package helloaworld; service YodelayAPI { rpc SayHello (HelloRequest) returns (HelloReply) {} }message HelloRequest { string port = 1; string packageName = 2; string service = 3; string message = 4; string protoObject = 5; } message HelloReply { string message = 1; }"
// }
// the serice and the message are unique based on what the user chooses after we parse the orional .proto file in /upload.


function grpcRequest(serv) {
  console.log('------Start gRPC Request------')
// when a string is passed to the back end as a string we will then use this method:
// it's passed to express on the req.body which we pass in as the input 
  // console.log("grpcRequest input: ", serv)
  // let input = JSON.parse(serv)
  // this is what is being sent to us in the req.body:
  let input = serv;
  // console.log("grpcRequest input proto object: ", input.protoObject)
// MESSAGE FIELDS:
// this is where we are sending the test:
  let port = input.port;
  // console.log('request port: ', port)
  let packageName = input.packageName;
  let service = input.service;
  let message = input.message;
  // the proto object is where we are passed in the .proto file from the server_client
  // we then take this object and write it to the temp output.proto file in the proto folder:
  let protoObject = input.protoObject;
  // console.log('proto obj: ', protoObject)
  let output;

// WRITE TO TEMP .PROTO
  // now let's write our protoObject string to the output.proto file:
  fs.writeFileSync("./protos/output.proto", protoObject, 'utf8', function (err) {
      if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
  });
  
  // BUILD DEFINITION AND DESCRIPTOR:
  // now we have a path for our proto:
  const PROTO_PATH = __dirname + '/../protos/output.proto';

  // and a config object:
  const CONFIG_OBJECT = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }

  // now that the file is written we want to create our package definition:
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, CONFIG_OBJECT);
  // console.log('package: ', packageDefinition)
  //  this gives us the proto package name as well as any service names:
  // for (let property in packageDefinition) {
  //   // console.log(property)
  // }

  // this is how you grab the .proto file package name:
let protoPackageName2 = Object.keys(packageDefinition)[0].split('.')[0]

  // let's use the package definition to create our descriptor:
  const descriptor = grpc.loadPackageDefinition(packageDefinition)[protoPackageName2];
  // console.log('descriptor: ', descriptor)
  // this gets us the message name form the proto file:
  // console.log('des new: ', descriptor.HelloRequest.type.field[0].name);
  // console.log('des new: ', descriptor.HelloRequest.type);

  // console.log('service: ', service)

// DECLARE PACKAGE:
// service was passed in by user in the 'service' variable:
  const package = new descriptor[service](port, grpc.credentials.createInsecure());
// console.log('grpc descriptor: ', descriptor[service])
  grpc_promise.promisifyAll(package);

  // console.log('sending port to gRPC server', port)

  // what rpc are we testing?
  // console.log('message: ', message)

  return package[message]()
  .sendMessage({port: port, packageName: packageName, service: service, message: message, protoObject: protoObject})
  .then( res => {
    // console.log('Greeting: ', res)
    output = res;
    // console.log('output', output)
      console.log('------Returning gRPC Result------')
      return output
    })
    .catch(err => console.error(err))

    
}

module.exports = { 
  grpcRequest,
  parseProto
};





// OLD CODE:
// 
// 
// JSON Object: 
// 
// when the .proto file is passed as a JSON object we use this method to pass it to our grpcRequest helper function
// FRONT END:
// const stringDefinition = JSON.stringify(packageDefinition);
//  Let's check to see if we stringifyed it!
// console.log("stringify: ", stringDefinition);
// this is where the frontend passes to the backend:
// console.log('______Passed in from the Front End_______');
// 
// BACK END:
// 
// Write the JSON object locally: 
// 
// File location:
// this is the file we are going to write the proto to:
// const inputProto = require('../protos/output.proto');
// console.log(inputProto)
// Parse:
// const JSONDefinition = JSON.parse(inputProto);
// console.log('JSONDefinition: ', JSONDefinition);

// 
// STRING:
// 
// when a string is passed to the back end we will then use this method:
// 
// first we 
// 
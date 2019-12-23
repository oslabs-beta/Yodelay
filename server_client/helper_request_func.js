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


function parseProto(input) {
// MESSAGE FIELDS:
console.log('-----Parsing Proto-----')
let port = input.port;
// console.log('port: ', port)
let packageName = input.packageName;
let service = input.service;
let message = input.message;
// the proto object is where we are passed in the .proto file from the server_client
// we then take this object and write it to the temp output.proto file in the proto folder:
let protoObject = input.protoObject;
console.log('proto obj: ', protoObject)
let output;

}




function grpcRequest(input) {
// when a string is passed to the back end as a string we will then use this method:
// it's passed to express on the req.body which we pass in as the input 
  // console.log("grpcRequest input: ", input)

// MESSAGE FIELDS:
  let port = input.port;
  // console.log('port: ', port)
  let packageName = input.packageName;
  let service = input.service;
  let message = input.message;
  // the proto object is where we are passed in the .proto file from the server_client
  // we then take this object and write it to the temp output.proto file in the proto folder:
  let protoObject = input.protoObject;
  console.log('proto obj: ', protoObject)
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
  console.log('package: ', packageDefinition)
  //  this gives us the proto package name as well as any service names:
  // for (let property in packageDefinition) {
  //   // console.log(property)
  // }

  // let's use the package definintion to create our descriptor:
  const descriptor = grpc.loadPackageDefinition(packageDefinition).helloaworld;
  console.log('descriptor: ', descriptor)
  // this gets us the message name form the proto file:
  console.log('des new: ', descriptor.HelloRequest.type.field[0]);
  console.log('des new: ', descriptor.HelloRequest.type);


// DECLARE PACKAGE:
  const package = new descriptor.YodelayAPI(port, grpc.credentials.createInsecure());

  grpc_promise.promisifyAll(package);

  return package.sayHello()
    .sendMessage({port: port, packageName: packageName, service: service, message: message, protoObject: protoObject})
    .then( res => {
      // console.log('Greeting: ', res)
      output = res;
      // console.log('output', output)
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
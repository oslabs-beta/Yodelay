const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');
// grab the proto path:
const PROTO_PATH = __dirname + '/../protos/helloworld.proto';
const fs = require('fs');

const CONFIG_OBJECT = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}
// synchronously compiles and loads the .proto file into a definition
// this will be moved to the front end:
const packageDefinition = protoLoader.loadSync(PROTO_PATH, CONFIG_OBJECT);

// let's see if we can turn it into a json object to be passed to the backend:
const stringDefinition = JSON.stringify(packageDefinition);

//  Let's check to see if we stringifyed it!
// console.log("stringify: ", stringDefinition);

// this is where the frontend passes to the backend:
console.log('______Passed in from the Front End_______');


// now let's write a file to the proto file with our passed in stringified proto file: 
fs.writeFile("./protos/output.proto", stringDefinition, 'utf8', function (err) {
  if (err) {
    console.log("An error occurred while writing JSON Object to File.");
    return console.log(err);
  }
  console.log("JSON file has been saved.");
});

// this is the file we are going to write the proto to:
const inputProto = require('../protos/output.proto');

console.log(inputProto)
// Now let's parse it back :
const JSONDefinition = JSON.parse(inputProto);
console.log('JSONDefinition: ', JSONDefinition);



// * generates a descriptor Object from the loaded API definition
const descriptor = grpc.loadPackageDefinition(JSONDefinition).helloworld;
// console.log(descriptor);



function grpcRequest(input) {
  let port = input.port
  // declare the package.
  const package = new descriptor.YodelayAPI(port, grpc.credentials.createInsecure());
  
  grpc_promise.promisifyAll(package);

  let inputName = input.name;
  let output;

  return package.sayHello()
    .sendMessage({name: inputName})
    .then( res => {
      console.log('Greeting: ', res)
      output = res;
      // console.log(output)
      return output
    })
    .catch(err => console.error(err))
}

module.exports = grpcRequest;
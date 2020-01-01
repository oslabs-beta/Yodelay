const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');
const fs = require('fs');

// input: .proto file
// output: {protoFile: “the text of the proto file”, definition: {}, package: '', protoDescriptor: {}, services: [{}, {}, {}]}
async function parseProto(uploadParsedReqBody) {
// MESSAGE FIELDS:
console.log('-----Start Parsing Proto-----')

// the proto object is where we are passed in the .proto file from the server_client
// we then take this object and write it to the temp output.proto file in the proto folder:

let output = {};

const protoFile = uploadParsedReqBody;
output.protoFile = protoFile;

// WRITE TO TEMP .PROTO
  // now let's write our protoObject string to the output.proto file:
fs.writeFileSync("./protos/output.proto", protoFile, 'utf8', function (err) {
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
output.definition = packageDefinition;

// this is how you grab the .proto file package name:
const protoPackageName = await Object.keys(packageDefinition)[0].split('.')[0]
output.package = protoPackageName;

// let's use the package definintion to create our descriptor:
const descriptor = grpc.loadPackageDefinition(packageDefinition)[protoPackageName];
output.protoDescriptor = descriptor;

// Creating the big-ass services object, which includes the various services, methods, messages, and message fields/types
const servicesObj = {};
for (let [service, serviceValue] of Object.entries(descriptor)) {
  if (typeof serviceValue === 'function') {
    servicesObj[service] = {};
    for (let [serviceMethodName, serviceMethodValue] of Object.entries(serviceValue.service)) {
      const messageName = serviceMethodValue.requestType.type.name;
      const messageFieldsRawData = serviceMethodValue.requestType.type.field;
      servicesObj[service][serviceMethodName] = {};
      servicesObj[service][serviceMethodName][messageName] = {};
      for (let messageInfo of messageFieldsRawData) {
        const messageField = messageInfo.name;
        const messageFieldType = messageInfo.type;
        servicesObj[service][serviceMethodName][messageName][messageField] = messageFieldType
      }
    }
  }
}
output.services = servicesObj;

console.log('-----done parsing proto-----')

return output;
}

function grpcRequest(serviceParsedReqBody) {
  console.log('------Start gRPC Request------')
  // console.log('serviceParsedReqBody: ', serviceParsedReqBody)
// when a string is passed to the back end as a string we will then use this method:
// it's passed to express on the req.body which we pass in as the input 
  // console.log("grpcRequest input: ", serviceParsedReqBody)
  // let input = JSON.parse(serviceParsedReqBody)
  // this is what is being sent to us in the req.body:
  let input = serviceParsedReqBody;
  // console.log("grpcRequest input proto object: ", input.protoObject)
// MESSAGE FIELDS:
// this is the server where we are sending the gRPC test to:
  let url = input.url;
  // console.log('request url: ', url)
  
  // name of the .proto package:
  let packageName = input.packageName;
  // service & request input from the front end drop down
  let serviceInput = input.serviceInput;
  let requestInput = input.requestInput;
  // this is the message input we are passing to the grpc server:
  let messageInput = JSON.parse(input.messageInput);
  // console.log('messageInput: ', messageInput)
  // the proto object is where we are passed in the .proto file from the server_client
  // we then take this object and write it to the temp output.proto file in the proto folder:
  let protoFile = input.protoFile;
  let protoDescriptor = input.protoDescriptor;
  // console.log('proto obj: ', protoObject)
  let output;

// WRITE TO TEMP .PROTO
  // now let's write our protoObject string to the output.proto file:
  fs.writeFileSync("./protos/output.proto", protoFile, 'utf8', function (err) {
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
  
  // this is how you grab the .proto file package name:
  let protoPackageName2 = Object.keys(packageDefinition)[0].split('.')[0]
  
  // first timestamp to be used for timing the round trip:
  const time = process.hrtime();

  // let's use the package definition to create our descriptor:
  const descriptor = grpc.loadPackageDefinition(packageDefinition)[protoPackageName2];
  
  // DECLARE PACKAGE:
  // service was passed in by user in the 'service' variable:
  const package = new descriptor[serviceInput](url, grpc.credentials.createInsecure());

  // todo parse messageInput and pass through to the .sendmessage.
  // messageInput is an object with all of the fields in it. 
  // the gRPC server is expecting the fields 
  // we have to 
  grpc_promise.promisifyAll(package);
  // console.log('gRPCPackage: ', package[requestInput])
  // console.log(url)
  return package[requestInput]()
  .sendMessage(messageInput)
  .then( res => {
    // console.log('Greeting: ', res)
    output = res;
    // console.log('output', output)
      console.log('------Returning gRPC Result------')
      // timestamps server call as an array
      // index 0 is seconds and index 1 is nanoseconds
      output.responseTime = process.hrtime(time);
      return output
    })
    .catch(err => console.error(err))

    
}

module.exports = { 
  grpcRequest,
  parseProto
};
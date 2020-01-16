const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const grpc_promise = require("grpc-promise");
const fs = require("fs");
const { EventEmitter } = require("events");
// input: .proto file
// output: {protoFile: "the text of the proto file", definition: {}, package: '', protoDescriptor: {}, services: [{}, {}, {}]}
async function parseProto(uploadParsedReqBody) {
  // MESSAGE FIELDS:
  console.log("-----Start Parsing Proto-----");
  // the proto object is where we are passed in the .proto file from the server_client
  // we then take this object and write it to the temp output.proto file in the proto folder:
  let output = {};
  const protoFile = uploadParsedReqBody;
  output.protoFile = protoFile;
  // WRITE TO TEMP .PROTO
  // now let's write our protoObject string to the output.proto file:
  fs.writeFileSync("./protos/output.proto", protoFile, "utf8", function (err) {
    if (err) {
      console.log("An error occurred while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
  // BUILD DEFINITION AND DESCRIPTOR:
  // now we have a path for our proto:
  const PROTO_PATH = __dirname + "/../protos/output.proto";
  // and a config object:
  const CONFIG_OBJECT = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  };
  // now that the file is written we want to create our package definition:
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, CONFIG_OBJECT);
  output.definition = packageDefinition;

  
  // let's use the package definintion to create our descriptor:
  
  const descriptorPre = grpc.loadPackageDefinition(packageDefinition);
  // this is how you grab the .proto file package name:
  const protoPackageName = Object.keys(descriptorPre)[0];
  const descriptor = descriptorPre[protoPackageName];
  output.package = protoPackageName;
  output.protoDescriptor = descriptor;
  // Creating the services object, which includes the various services, methods, messages, and message fields/types
  const servicesObj = {};

  for (let [service, serviceValue] of Object.entries(descriptor)) {
    if (typeof serviceValue === "function") {
      servicesObj[service] = {};
      for (let [serviceMethodName, serviceMethodValue] of Object.entries(
        serviceValue.service
      )) {
        const isMethodRequestStreaming = serviceMethodValue.requestStream;
        const isMethodResponseStreaming = serviceMethodValue.responseStream;
        
        let streamingType = "unary";
        if (isMethodResponseStreaming) {
          streamingType = "serverStreaming";
        }
        if (isMethodRequestStreaming) {
          streamingType = "clientStreaming";
        }
        if (isMethodRequestStreaming && isMethodResponseStreaming) {
          streamingType = "bidiStreaming";
        }
        
        const messageName = serviceMethodValue.requestType.type.name;
        const messageFieldsRawData = serviceMethodValue.requestType.type.field;
        servicesObj[service][serviceMethodName] = {};
        servicesObj[service][serviceMethodName][messageName] = {};
        servicesObj[service][serviceMethodName]["type"] = streamingType;

        for (let messageInfo of messageFieldsRawData) {
          console.log('messageInfo:: ', messageInfo)
          const messageField = messageInfo.name;
          let messageFieldType;
          if (messageInfo.typeName !== '') {
            messageFieldType = messageInfo.typeName;
          } else {
            messageFieldType = messageInfo.type;
          }
          servicesObj[service][serviceMethodName][messageName][
            messageField
          ] = messageFieldType;
        }
      }
    }
  }
  output.services = servicesObj;
  
  return output;
}

class GrpcRequestClass extends EventEmitter {
  constructor(websocket) {
    super();
    this.ws = websocket;
    this.url = undefined
    this.serviceInput =  undefined;
    this.messageInput = undefined;
    this.requestInput = undefined;
    this.package = undefined;
    this.protoFile = undefined;
    this.streamType = undefined;
    this._call = undefined;
  }

  

  sendInit (reqbody) {
    this.url = reqbody.url;
    this.serviceInput =  reqbody.serviceInput;
    this.messageInput = reqbody.messageInput;
    this.requestInput = reqbody.requestInput;
    this.package = reqbody.package;
    this.protoFile = reqbody.protoFile;
    this.streamType = reqbody.requestInput.streamType;
    this._call = undefined;

    fs.writeFileSync("./protos/output.proto", this.protoFile, "utf8", function (err) {
      if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });

    const PROTO_PATH = __dirname + "/../protos/output.proto";
    const CONFIG_OBJECT = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    };

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, CONFIG_OBJECT);
    let protoPackageName2 = Object.keys(packageDefinition)[0].split(".")[0];
    let packageDefinitionName = Object.keys(packageDefinition)[0];
    const descriptor = grpc.loadPackageDefinition(packageDefinition)[
      protoPackageName2
    ];
    let servicePackage;

    try {
      servicePackage = new descriptor[this.serviceInput](
        this.url,
        grpc.credentials.createInsecure()
      );
    } catch {
      console.log('error creating servicePackage (descriptor) in sendInit func.')
    }

    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    let ws = this.ws;
    let messageInput;
    try {
      messageInput = JSON.parse(this.messageInput)
    } catch {
      console.log('error JSON parsing messageInput in sendInit')
    }
    let requestInput = this.requestInput;
    let streamType = this.streamType;

    if (streamType === "unary") {
      // UNARY
      let reqTime = process.hrtime();

      try {
        servicePackage[requestInput.methodName](messageInput, function (
          err,
          feature
        ) {
          if (err) {
            let unaryError = JSON.stringify(err)
            console.log(unaryError)
            ws.send(unaryError);
          } else {
            let resTime = process.hrtime();
            let resTimeSec = resTime[0] - reqTime[0];
            let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
            let resTimeStr = `Response Time: ${resTimeSec}s ${resTimeMs}ms`;
            let message = '';
            try {
              message = JSON.stringify(feature);
              ws.send(message);
            } catch {
              console.log('error JSON parsing unary gRPC response');
              ws.send('error JSON parsing unary gRPC response');
            }
          }
        });
      } catch {
        console.log('error in streamType === "unary"')
      }
      return this;
    } else if (requestInput.streamType === "serverStreaming") {
          // STREAMING
          
          let reqTime = process.hrtime();
          let call; 
          try {
            call = servicePackage[requestInput.methodName](messageInput);
          } catch {
            console.log('error creating call - servicePackage')
          }
          this._call = call;
          try {
            call.on("data", function (feature) {
              let resTime = process.hrtime();
              let resTimeSec = resTime[0] - reqTime[0];
              let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
              let resTimeStr = `Response Time: ${resTimeSec}s ${resTimeMs}ms`;
              let message = JSON.stringify(feature);
              ws.send(message);
            });
  
            call.on("end", function () {
              ws.send('server streaming has ended')
            });
            call.on("error", function (e) {
              () => {
                ws.send('server streaming ending')
              }
            });
          } catch {
            console.log('server streaming ERROR')
            ws.send('server streaming ERROR')
          }
      } else if (requestInput.streamType === "clientStreaming") {
            //////// CLIENT STREAMING //////////
        //receive data from gRPC demo server (resulting from call.write)
        //link to the connection of the grpc server, must remain on clientStreaming
        let reqTime = process.hrtime();
        const call = servicePackage[requestInput.methodName](function (error, feature) {
          if(error) {
            let clientStreamingError = JSON.stringify(error)
            console.log(clientStreamingError)
            ws.send(clientStreamingError);
          } 
          ws.send(JSON.stringify(feature))
        });

        try {

          call.write(messageInput)
          this._call = call;
  
          call.on("data", function(feature) {
            let resTime = process.hrtime();
            let resTimeSec = resTime[0] - reqTime[0];
            let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
            let resTimeStr = `Response Time: ${resTimeSec}s ${resTimeMs}ms`;
            let message = JSON.stringify(feature);
            ws.send(message);
          });
          call.on("end", function() {
            ws.send('server has ended the client streaming')
          });
          call.on("error", function(e) {
            // An error has occurred and the stream has been closed.
            let clientStreamError = JSON.stringify(e)
            ws.send('the following error occurred in the gRPC server: ', clientStreamError)
          });
        } catch {
          console.log('Error in client-streaming')
          ws.send('Error in client-streaming')
        }

      } else if (requestInput.streamType === 'bidiStreaming'){
        let reqTime = process.hrtime();
        let call = servicePackage[requestInput.methodName]();
        this._call = call;

        call.on("data", function (feature) {
          let resTime = process.hrtime();
          let resTimeSec = resTime[0] - reqTime[0];
          let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
          let resTimeStr = `Response Time: ${resTimeSec}s ${resTimeMs}ms`;
          let message = JSON.stringify(feature);
          ws.send(message);
        });

        call.on("end", function () {
          ws.send('server has ended the bidirectional streaming')
        });

        call.on("error", function (e) {
          let bidiError = JSON.stringify(e)
          ws.send('the following error occurred in the gRPC server: ', bidiError)
        });
      }
  } 
}

module.exports = {
  GrpcRequestClass,
  parseProto
};

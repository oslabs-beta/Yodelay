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
  // this is how you grab the .proto file package name:
  const protoPackageService = Object.keys(packageDefinition)[0];
  const protoPackageName = protoPackageService.split(".")[0];
  output.package = protoPackageName;
  // let's use the package definintion to create our descriptor:
  const descriptor = grpc.loadPackageDefinition(packageDefinition)[
    protoPackageName
  ];
  output.protoDescriptor = descriptor;
  // Creating the big-ass services object, which includes the various services, methods, messages, and message fields/types
  const servicesObj = {};

  for (let [service, serviceValue] of Object.entries(descriptor)) {
    // console.log('servicerequestStream: ', serviceValue.service)
    // console.log('serviceValue', serviceValue)
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
        console.log('here///////////////////////////////', streamingType)
        const messageName = serviceMethodValue.requestType.type.name;
        const messageFieldsRawData = serviceMethodValue.requestType.type.field;
        servicesObj[service][serviceMethodName] = {};
        servicesObj[service][serviceMethodName][messageName] = {};
        servicesObj[service][serviceMethodName]["type"] = streamingType;
        for (let messageInfo of messageFieldsRawData) {
          const messageField = messageInfo.name;
          const messageFieldType = messageInfo.type;
          servicesObj[service][serviceMethodName][messageName][
            messageField
          ] = messageFieldType;
        }
      }
    }
  }
  console.log("services Obj", servicesObj);
  output.services = servicesObj;
  console.log("-----done parsing proto-----");
  return output;
}

class GrpcRequestClass extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
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
    const servicePackage = new descriptor[this.serviceInput](
      this.url,
      grpc.credentials.createInsecure()
    );

    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    let ws = this.ws; 
    let messageInput = JSON.parse(this.messageInput)
    let requestInput = this.requestInput;
    let streamType = this.streamType;

    console.log('///////////////', this.messageInput)
    if (streamType === "unary") {
      // UNARY
      let reqTime = process.hrtime();
      servicePackage[requestInput.methodName](messageInput, function (
        err,
        feature
      ) {
        if (err) {
          console.log(err);
          ws.send(err);
        } else {
          let resTime = process.hrtime();
          let resTimeSec = resTime[0] - reqTime[0];
          let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
          let resTimeStr = `Unary Call Response Time: ${resTimeSec}s ${resTimeMs}ms`;
          feature.message = `${resTimeStr}\n${feature.message}`;
          ws.send(feature.message);
        }
        // ws.close();
        // ws.onclose = function() {
        //   console.log(ws.readyState);
        // };
      });

      return this;
    } else if (requestInput.streamType === "serverStreaming") {
          // STREAMING
          
          let reqTime = process.hrtime();
          const call = servicePackage[requestInput.methodName](messageInput);
          console.log("msginput", messageInput);
          // call.write({ greet: messageInput })
          call.on("data", function (feature) {
            console.log("feature received ", feature);
            let resTime = process.hrtime();
            let resTimeSec = resTime[0] - reqTime[0];
            let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
            let resTimeStr = `Server Streaming Response Time: ${resTimeSec}s ${resTimeMs}ms`;
            feature.result = `${resTimeStr}\n${feature.result}`;
            ws.send(feature.result);
          });
          call.on("end", function () {
            console.log("this server streaming has ended");
            // ws.close();
            // ws.onclose = function() {
            //   console.log(ws.readyState);
            // };
          });
          call.on("error", function (e) {
            // An error has occurred and the stream has been closed.
            // ws.close();
            // ws.onclose = function() {
            //   console.log(ws.readyState);
            // };
          });
      } else if (requestInput.streamType === "clientStreaming") {
            //////// CLIENT STREAMING //////////
        //receive data from gRPC demo server (resulting from call.write)
        //link to the connection of the grpc server, must remain on clientStreaming

        const call = servicePackage[requestInput.methodName](function (error, response) {
          if(error) {
            console.log(error)
          } 
    
          ws.send(response.result)
        });

        call.write(messageInput)
        this._call = call;
        

        call.on("data", function(response) {
          console.log("response received ");
          ws.send(response.result);
        });
        call.on("end", function() {
          // ws.close();
          // ws.onclose = function() {
          //   console.log(ws.readyState);
          // };
        });
        call.on("error", function(e) {
          // An error has occurred and the stream has been closed.
          // ws.close();
          // ws.onclose = function() {
          //   console.log(ws.readyState);
          // };
        });
      } else if (requestInput.streamType === 'bidiStreaming'){
        let reqTime = process.hrtime();
        const call = servicePackage[requestInput.methodName]();
        this._call = call
        call.on("data", function (feature) {
          let resTime = process.hrtime();
          let resTimeSec = resTime[0] - reqTime[0];
          let resTimeMs = round(resTime[1] / 1000000 - reqTime[1] / 1000000, 2);
          let resTimeStr = `Server Response Time: ${resTimeSec}s ${resTimeMs}ms`;
          feature.result = `${resTimeStr}\n${feature.result}`;
          ws.send(feature.result);
        });
        call.on("end", function () {
          ws.send('server has ended the bidirecitonal streaming')
        });
        call.on("error", function (e) {
          ws.send('the following error occurred in the gRPC server: ', e)
        });
      }
  } 
}

module.exports = {
  GrpcRequestClass,
  // grpcRequest,
  parseProto
};

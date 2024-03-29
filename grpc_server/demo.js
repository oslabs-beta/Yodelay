let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
// this is our test grpc server:
let PROTO_PATH = __dirname + "/../protos/demo.proto";
let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const packageName = "demo";
let demo_proto = grpc.loadPackageDefinition(packageDefinition)[packageName];
// console.log(demo_proto)
// first demo function:
function YodelayWorld(call, callback) {
  console.log("call: ", call);
  const whenI = call.request.whenI;
  callback(null, {
    message: `When I yodel ${whenI} -->  you yodel IiiOoo!!!! YODELAY!!! --> ________________`
  });
}
// second demo:
function toLowerCase(call, callback) {
  // console.log(call.request)
  const value = call.request.uppercase;
  const lower = value.toLowerCase();
  callback(null, {
    message: `When you input this uppercase string: ${value} the gRPC server runs the function and responds with this output: ${lower} <--`
  });
}
// run innerRps function n times
function gRPCPermutations(call, callback) {
  let n = call.request.n;
  let arr = [""];
  while (n > 0) {
    arr = innerGRPC(arr);
    n -= 1;
  }
  console.log(arr);
  const str = JSON.stringify(arr);
  console.log(str);
  callback(null, {
    message: str
  });
  function innerGRPC(arr) {
    const g = arr.map(letter => `g${letter}`);
    const r = arr.map(letter => `R${letter}`);
    const p = arr.map(letter => `P${letter}`);
    const c = arr.map(letter => `C${letter}`);
    return [...g, ...r, ...p, ...c];
  }
}
// server streaming example
function greetManyTimes(call, callback) {
  // console.log(call);
  let first_name = call.request.greeting.first_name;
  // console.log(call.request)
  let count = 0,
    intervalID = setInterval(function() {
      // var greetManyTimesResponse = new demo_proto.GreetManyTimesResponse();
      let greetManyTimesResponse = {};
      greetManyTimesResponse.result = first_name;
      // console.log(greetManyTimesResponse.result);
      // setup streaming
      call.write(greetManyTimesResponse);
      if (++count > 9) {
        clearInterval(intervalID);
        call.end(); // we have sent all messages!
      }
    }, 1000);
}

//Client streaming example
//In Paulo's example - he uses setInterval to make the client programmatically send requests using setInterval. After all requests are sent, on.end is called which indicates all messages are sent
//Paulo's server just listens for call.on(end)

//For us --> on client side, message should be sent added to responseStream everytime sendReq button is clicked
//Upon user clicking end stream button, call.end happens and server sends back response
//long greet response = "whew that was a long one - you yodeled xxx number of times!"

function longGreet(call, callback) {
  let greetArr = [];
  let greet = call.request.greet;
  //on receiving data, push greeting into array
  call.on("data", greet => {
    greetArr.push(greet);
  });

  //upon ending, return response
  call.on("end", greet => {
    let numOfYodel = greetArr.length - 1;
    let LongGreetResponse = `You Yodeled ${numOfYodel} of times!`;
    console.log("client streaming has ended");
    //or should this be ws.send? it needs to go to front end
    call.write(LongGreetResponse);
  });
}

// bidi streaming example
// async function sleep(interval) {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(), interval);
//   });
// }
// async function greetEveryone(call, callback) {
//   call.on("data", response => {
//     // let firstName = call.request.greeting.first_name
//     // let lastName = call.request.greeting.last_name
//     // let fullName = firstName + ' ' + lastName
//     console.log('here is the data stupid ', response)
//     // console.log("Hello " + fullName);
//   });
//   call.on("error", error => {
//     console.error(error);
//   });
//   call.on("end", () => {
//     console.log("Server The End...");
//   });
//   for (let i = 0; i < 10; i++) {
//     call.write({ result: 'Tammy Tan' });
//     await sleep(1000);
//   }
//   call.end();
// }
function main() {
  let server = new grpc.Server();
  server.addService(demo_proto.itIsDemoTimeYodelay.service, {
    YodelayWorld,
    toLowerCase,
    gRPCPermutations,
    greetManyTimes,
    longGreet
    // greetEveryone
  });
  server.bind("0.0.0.0:8080", grpc.ServerCredentials.createInsecure());
  server.start();
}
main();
console.log(`gRPC💥 'n on port: 0.0.0.0:8080`);

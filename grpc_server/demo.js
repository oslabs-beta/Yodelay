const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/demo.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const demo = grpc.loadPackageDefinition(packageDefinition).demo;

const MAX_PERMUTATION_DEPTH = 8;

function yodelayWorld(call, callback) {
  const whenI = call.request.whenI || "";
  callback(null, {
    message: `When I yodel ${whenI} -->  you yodel IiiOoo!!!! YODELAY!!! --> ________________`
  });
}

function toLowerCase(call, callback) {
  const value = call.request.uppercase || "";
  callback(null, {
    message: `When you input this uppercase string: ${value} the gRPC server runs the function and responds with this output: ${value.toLowerCase()} <--`
  });
}

function gRPCPermutations(call, callback) {
  let n = Number(call.request.n) || 0;
  if (n > MAX_PERMUTATION_DEPTH) n = MAX_PERMUTATION_DEPTH;
  let arr = [""];
  while (n > 0) {
    arr = innerGRPC(arr);
    n -= 1;
  }
  callback(null, { message: JSON.stringify(arr) });
}

function innerGRPC(arr) {
  const g = arr.map((letter) => `g${letter}`);
  const r = arr.map((letter) => `R${letter}`);
  const p = arr.map((letter) => `P${letter}`);
  const c = arr.map((letter) => `C${letter}`);
  return [...g, ...r, ...p, ...c];
}

function greet(call, callback) {
  const greeting = call.request.greeting || {};
  callback(null, { result: helloName(greeting.first_name, greeting.last_name) });
}

function greetManyTimes(call) {
  const greeting = call.request.greeting || {};
  const first = greeting.first_name || "";
  let count = 0;
  const timer = setInterval(() => {
    if (call.cancelled) {
      clearInterval(timer);
      return;
    }
    try {
      call.write({ result: first });
    } catch (err) {
      clearInterval(timer);
      return;
    }
    count += 1;
    if (count >= 10) {
      clearInterval(timer);
      call.end();
    }
  }, 100);
  call.on("cancelled", () => clearInterval(timer));
  call.on("error", () => clearInterval(timer));
}

function longGreet(call, callback) {
  let count = 0;
  let settled = false;
  const finish = (err, value) => {
    if (settled) return;
    settled = true;
    callback(err, value);
  };
  call.on("data", () => {
    count += 1;
  });
  call.on("end", () => {
    finish(null, { result: `You Yodeled ${count} of times!` });
  });
  call.on("error", (err) => finish(err));
}

function greetEveryone(call) {
  call.on("data", (request) => {
    const greet = request.greet || {};
    call.write({ result: helloName(greet.first_name, greet.last_name) });
  });
  call.on("end", () => call.end());
  call.on("error", () => {});
}

function helloName(first, last) {
  return `Hello ${[first, last].filter(Boolean).join(" ")}`.trim();
}

function startDemo(port = 0, host = "127.0.0.1") {
  const server = new grpc.Server();
  server.addService(demo.itIsDemoTimeYodelay.service, {
    YodelayWorld: yodelayWorld,
    toLowerCase,
    gRPCPermutations,
    Greet: greet,
    GreetManyTimes: greetManyTimes,
    LongGreet: longGreet,
    GreetEveryone: greetEveryone
  });
  return new Promise((resolve, reject) => {
    server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, bound) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        port: bound,
        stop() {
          return new Promise((done) => server.tryShutdown(() => done()));
        }
      });
    });
  });
}

if (require.main === module) {
  const port = process.env.PORT || 8080;
  startDemo(port, "0.0.0.0").then(({ port: bound }) => {
    console.log(`demo gRPC listening on ${bound}`);
  });
}

module.exports = { startDemo };

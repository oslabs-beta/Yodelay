const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseProto, GrpcRequestClass } = require("./helper_request_func");
const app = express();
const expressWs = require("express-ws")(app);

const port = 4000;

app.use(cors());
app.use(bodyParser.text());
app.use(cookieParser());

app.get("/", (req, res) => res.send("🍻  Yodelay World  🍻"));
// * UPLOAD:
app.post("/upload", async (req, res) => {
  const parsedReqBody = JSON.parse(req.body);
  let output = await parseProto(parsedReqBody);
  res.json(output);
});

//Listens for messages
app.ws("/websocket", function(ws, req) {

  const grpcRequestClass = new GrpcRequestClass(ws);
  try {
    ws.on("message", function (msg) {
      let parsedReqBody;
      try {
        parsedReqBody = JSON.parse(msg);
      } catch {
        ws.send("message", 'error parsing JSON in ws.on message')
      }
      if (parsedReqBody.wsCommand === 'sendInit') {
        console.log('sendInit')
        grpcRequestClass.sendInit(parsedReqBody);
      } else if (parsedReqBody.wsCommand === 'push') {
        console.log('push')
        let messageInput;
        try {
          messageInput = JSON.parse(parsedReqBody.messageInput);
        } catch {
          console.log('error parsing messageInput in ws-router - "push"')
        }
        console.log('||||||||||||||||PUSH', messageInput)
        grpcRequestClass._call.write(messageInput);
      } else if (parsedReqBody.wsCommand === 'end') {
        if(parsedReqBody.requestInput.streamType === 'serverStreaming') {
        grpcRequestClass._call.cancel();
        console.log('Cancel')
        } else {
          grpcRequestClass._call.end();
          console.log('end')
        }
      }
    });
  } catch {
    console.log('error in ws')
  }
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
// Global error handling:
app.use(function (err, req, res, next) {
  const defaultError = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" }
  };
  const newErrObj = Object.assign(defaultError, err);
  console.log(newErrObj);
  res.status(newErrObj.status).json(newErrObj.message);
});
app.listen(port, () =>
  console.log(`  👽  invasion happening on port: ${port} `)
);

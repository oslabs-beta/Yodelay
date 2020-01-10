const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { grpcRequest, parseProto } = require('./helper_request_func');

const app = express();
const expressWs = require('express-ws')(app);
// changed to port 4000 because react hot module runs on 3000
const port = 4000;

// this line hackily solves the CORS errors when sending post requests to /upload
// refactor eventually
app.use(cors());

// Parsing!
//  parse to text (bodyParser.json breaks upload fetch request)
app.use(bodyParser.text());
// parse cookies
app.use(cookieParser());

// uncomment this flow test to see all incoming requests printed -- of great help while debugging
// app.use((req, res, next) => {
//   console.log('*************************************************************');
//   console.log(
//     'method:',
//     req.method,
//     'path',
//     req.path,
//     'body:',
//     req.body,
//     'cookies:',
//     req.cookies
//   );
//   console.log('*************************************************************');
//   next();
// });

// Root:
app.get('/', (req, res) => res.send('🍻  Yodelay World  🍻'));

// * UPLOAD:
// when we hit the /upload endpoint we take in the request body and pass it as an argument to the helper request function:
// Input req.body
// output: {protoFile: “the text of the photo file”, services: [{}, {}, {}], protoDescription: {}}
app.post('/upload', async (req, res) => {
  // was able to send the file so that a simple JSON.parse takes care of it
  console.log(
    'HERE IS THE PARSED PROTOFILE STRING SENT TO /UPLOAD ENPOINT:',
    JSON.parse(req.body)
  );

  const parsedReqBody = JSON.parse(req.body)

  // console.log('---req.body:', req.body, '---/upload req---');
  // to our grpc request function
  // console.log('/upload req.body: ', req.body)
  let output = await parseProto(parsedReqBody);
  // console.log('/upload req.body output: ', output)
  // then send response with the output that's been jsonified.
  // this is goiing to be the protoFile, services we pull and the protoDescription:
  res.json(output);
});


// * SERVICE:
// * Start GRPC Server Call:
// front end sends back the request when they hit the /service endpoint.
app.post('/service', async (req, res) => {
  console.log('---------SERVICE-------------');
  const parsedReqBody = JSON.parse(req.body)
  // to our grpc request function
  // console.log('/service req.body: ', req.body)
  let output = await grpcRequest(parsedReqBody).catch();
  // console.log('/service req.body output: ', output)
  // then send response with the output that's been jsonified.
  res.json(output);
});


// websocket routes for streaming 

// starts client handshake
// app.get('/websocket', function (req, res, next) {
//   console.log('get route', req.testing);
//   res.end();
// });

//Listens for messages
app.ws('/websocket', function (ws, req) {
  ws.on('message', function (msg) {
    console.log('app.ws msg: ', msg);
    const parsedReqBody = JSON.parse(msg)
    grpcRequest(parsedReqBody, ws)



  });

  // setInterval(() => {
  //   ws.send('I am your server, made of sockets')
  // }, 1000)
  // ws.send('I am your server, made of sockets')
  // console.log('socket', req.testing);
});





// *
// * End GRPC Server Call

//cedric's upload path (likely to be deleted)
// app.post('/upload', (req, res) => {
//   console.log(
//     'here is the parsed protoFile string sent to /upload',
//     JSON.parse(req.body)
//   );
//   res.json('protoFile uploaded succesfully man');
// });

// Unknown Route:
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});



// Global error handling:
app.use(function (err, req, res, next) {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }
  };
  const newErrObj = Object.assign(defaultError, err);
  console.log(newErrObj);
  res.status(newErrObj.status).json(newErrObj.message);
});

app.listen(port, () =>
  console.log(`  👽  invasion happening on port: ${port} `)
);

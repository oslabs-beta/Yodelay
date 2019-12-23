const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const grpcRequest = require('./helper_request_func');
var cors = require('cors');

const app = express();
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
app.get('/', (req, res) => res.send('🍻  Yodelay World   🍻'));

// GRPC TEST:
app.post('/grpc', async (req, res) => {
  console.log('-----------------------------');
  // console.log('/grpc before calling function')

  let output = await grpcRequest(req.body);
  res.json(output);
});

//upload path
app.post('/upload', (req, res) => {
  console.log(
    'here is the parsed protoFile string sent to /upload',
    JSON.parse(req.body)
  );
  res.json('protoFile uploaded succesfully man');
});

// Unknown Route:
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Global error handling:
app.use(function(err, req, res, next) {
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

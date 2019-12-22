const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const grpcRequest = require('./helper_request_func');

const app = express();
// changed to port 4000 because react hot module runs on 3000
const port = 4000;

// Parsing!
//  parse to text (json breaks fetch request)
app.use(bodyParser.text());
// parse cookies
app.use(cookieParser());

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
  console.log('---req.body:', req.body, '---/upload req---');
  res.json('upload response man');
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

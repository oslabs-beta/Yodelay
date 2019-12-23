const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const grpcRequest = require('./helper_request_func')

const app = express();
// changed to port 4000 because react hot module runs on 3000
const port = 4000;

// Parsing!
//  parse to text (json breaks fetch request)
app.use(bodyParser.text());
// parse cookies
// app.use(cookieParser())

// Root:
app.get('/', (req, res) => res.send('🍻  Yodelay World  🍻'))


// * UPLOAD:
// when we hit the /upload endpoint we take in the request body and pass it as an argument to the helper request function:
app.post('/upload', async (req, res) => {
  console.log('---req.body:', req.body, '---/upload req---');
  // to our grpc request function
  // console.log('/upload req.body: ', req.body)
  let output = await helperFunctions.parseProto(req.body).catch();
  // console.log('/upload req.body output: ', output)
  // then send response with the output that's been jsonified. 
  res.json('upload response man');
})


// * SERVICE:
// * Start GRPC Server Call: 
app.post('/service', async (req, res) => {
  console.log('---------SERVICE-------------')
  // to our grpc request function
  // console.log('/service req.body: ', req.body)
  let output = await grpcRequest(req.body).catch();
  // console.log('/service req.body output: ', output)
  // then send response with the output that's been jsonified. 
  res.json(output)
})


// *
// * End GRPC Server Call






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

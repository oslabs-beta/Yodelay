const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const grpcRequest = require('./helper_request_func')

const app = express();
const port = 3000;


// Parsing!
// parse application/json
app.use(bodyParser.json())
// parse cookies
// app.use(cookieParser())

// Root:
app.get('/', (req, res) => res.send('🍻  Yodelay World   🍻'))

// GRPC TEST: when we hit the /grpc endpoint we take in the request body and pass it as an argument
app.post('/grpc', async (req, res) => {
  console.log('-----------------------------')
  // to our grpc request function
  // console.log('/grpc req.body: ', req.body)
  let output = await grpcRequest(req.body).catch();
  console.log('/grpc req.body output: ', output)

  // then send response with the output that's been jsonified. 
  res.json(output)
})



// Unknown Route:
app.use((req, res) =>  {
  res.status(404).send('Page Not Found')
})

// Global error handling:
app.use(function (err, req, res, next) {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }, 
  }
  const newErrObj = Object.assign(defaultError, err);
  console.log(newErrObj);
  res.status(newErrObj.status).json(newErrObj.message);
})


app.listen(port, () => console.log(`  👽  invasion happening on port: ${port} `))
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const grpcRequest = require('./helper_request_func')

// Parsing!
// parse application/json
app.use(bodyParser.json())
// parse cookies
app.use(cookieParser())

// Root:
app.get('/', (req, res) => res.send('🍻  Yodelay World   🍻'))

// GRPC TEST:
app.get('/grpc', (req,res) => {
  console.log('-----------------------------')
  console.log('/grpc before calling function')

  res.locals.anything = 'Davey';
  console.log(res.locals.anything)
  grpcRequest();
  res.json('message')
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


app.listen(port, () => console.log(`👽  👽  👽  👽  👽  👽  👽  👽  👽  INVASION HAPPENING ON PORT ${port} 👽  👽  👽  👽  👽  👽  👽  👽  👽`))
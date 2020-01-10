const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/websocket', function (req, res, next) {
  console.log('get route', req.testing);
  res.end();
});

app.ws('/websocket', function (ws, req) {
  ws.on('message', function (msg) {
    console.log(msg);
  });

  // setInterval(() => {
  //   ws.send('I am your server, made of sockets')
  // }, 1000)
  // ws.send('I am your server, made of sockets')
  console.log('socket', req.testing);
});

app.listen(8081, () =>
  console.log(`  👽  invasion happening on port: ${8081} `)
);



// const WebSocket = require('ws')


// const wss = new WebSocket.Server({ port: 8081 })



// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//   })
//   ws.send('yodelay!')
// })

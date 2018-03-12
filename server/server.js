const socketIO = require('socket.io');
const { IO } = require('./io')
const http = require('http');
const path = require('path');
const express = require('express');
const clientPath = path.join(__dirname, '../build');

//user express to server static files
const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);

//create IO instance
//all events are listened in io.listen method
const io = new IO(server);
io.listen();

server.listen(3001, ()=> {
  console.log('Waiting for clients to connect');
})

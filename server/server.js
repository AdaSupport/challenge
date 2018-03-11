const socketIO = require('socket.io');
const { IO } = require('./io')
const http = require('http');
const path = require('path');
const express = require('express');
const clientPath = path.join(__dirname, '../build');

const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = new IO(server);
io.listen();

server.listen(3001, ()=> {
  console.log('Waiting for clients to connect');
})

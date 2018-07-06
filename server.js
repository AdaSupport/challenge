import { createStore }   from 'redux';
import express           from 'express';
import path              from 'path';

import { serverReducer } from './src/reducers';

const app       = express();
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
const todoList  = require('./data.json');

const store = createStore(serverReducer);

// express server config
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// load initial Todos into the Redux store from data.json
store.dispatch({
  type: 'LOAD_TODOS',
  todoList: todoList
});

// send updated state to the clients each time state changes
store.subscribe(() => io.emit('state', store.getState()));

// as a client connects...
io.on('connection', socket => {
  // send updated state as a user connects
  io.emit('state', store.getState());

  // dispatch store once an 'action' event is received from the client
  socket.on('action', store.dispatch.bind(store));
});

http.listen(3003, function() {
  console.log('listening on *:3000');
});

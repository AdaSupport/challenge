import { createStore }   from 'redux';
import express           from 'express';
import { fromJS }        from 'immutable';
import path              from 'path';
import { serverReducer } from './src/reducers';

const app       = express();
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
const todoList  = require('./data.json');

// creates a Redux store based on the reducer function
const store = createStore(serverReducer);

// express server config
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// load initial Todos into the Redux store from
store.dispatch({
  type: 'LOAD_TODOS',
  todoList: fromJS(todoList)
});

// subscribe to further events each time state changes
store.subscribe(() => {
  // send updated state to the clients
  io.emit('state', store.getState().toJS());
});

// as a client connects...
io.on('connection', function(socket) {
  // send updated state as a user connects
  io.emit('state', store.getState().toJS());

  // dispatch store once an 'action' event is received from the client
  socket.on('action', store.dispatch.bind(store));
});

// listen for incoming connections on port 3003
http.listen(3003, function() {
  console.log('listening on *:3000');
});

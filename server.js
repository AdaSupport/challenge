const server = require('socket.io')();
const DB = require('./db');
const actions = require('./todo_actions');

server.on('connection', (client) => {
    // Accepts when a client makes a new todo
  client.on('make', (t) => {
    const newTodo = actions.make(t);
        // Send the latest todo to the other clients
    client.broadcast.emit('add', newTodo);
        // Sync the todo data with the originating client
    client.emit('sync', { todo: newTodo, cid: t.cid });
  });

  client.on('toggle', (data) => {
    const todo = actions.toggle(data);
    client.broadcast.emit('toggle', todo);
  });

  client.on('delete', (todoId) => {
    actions.delete(todoId);
    client.broadcast.emit('delete', todoId);
  });

  client.on('delete_all', () => {
    actions.deleteAll();
    client.broadcast.emit('delete_all');
  });

  client.on('complete_all', () => {
    actions.completeAll();
    client.broadcast.emit('complete_all');
  });

    // Send the DB downstream on connect
  client.emit('load', DB);
});

console.log('Waiting for clients to connect');
server.listen(3003);

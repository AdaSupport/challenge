const server = require('socket.io')();
const database = require('./database');
const DB = new database();

server.on('connection', (client) => {

    // Sends a message to all clients to reload all todos
    const reloadTodos = () => {
      server.emit('load', DB.values());
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = DB.newTodo(t.title);

        // Sends the new todo to all clients
        server.emit('new', newTodo);
    });

    client.on('update', (t) => {
        const updatedTodo = DB.updateTodo(t);
        server.emit('updated-todo', updatedTodo);
    });

    client.on('delete', (t) => {
        DB.deleteTodo(t);
        server.emit('deleted-todo', t);
    });

    client.on('delete-all', (t) => {
        DB.deleteAll();
        reloadTodos();
    });

    client.on('complete-all', (t) => {
        DB.completeAll();
        reloadTodos();
    });

    // Send the DB downstream on connect
    client.emit('load', DB.values());
});

console.log('Waiting for clients to connect');
server.listen(3003);

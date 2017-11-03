const server = require('socket.io')();
const database = require('./database');
const DB = new database();

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        client.emit('load', DB.values());
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

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

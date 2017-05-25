const server = require('socket.io')();
let DB = require('./db');
const Todo = require('./todo');
const events = require('./events')(server);

server.on('connection', (client) => {
    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todo to the other clients
        client.broadcast.emit('add', newTodo);
        // Sync the todo data with the originating client
        client.emit('sync', {todo: newTodo, cid: t.cid});
    });

    client.on('toggle', (data) => {
        const todo = DB.find((item) => item.id == data.id );
        todo.complete = !todo.complete;
        client.broadcast.emit('toggle', todo);
    });

    client.on('delete', (todoId) => {
        DB = DB.filter((item) => item.id != todoId)
        client.broadcast.emit('delete', todoId);
    });

    client.on('delete_all', () => {
        DB = [];
        client.broadcast.emit('delete_all');
    });

    client.on('complete_all', (todoId) => {
        DB = DB.map((item) => Object.assign({}, item, {complete: true}))
        client.broadcast.emit('complete_all');
    });

    // Send the DB downstream on connect
    client.emit('load', DB);
});

console.log('Waiting for clients to connect');
server.listen(3003);

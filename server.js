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

        // Send the latest todo to the client
        events.sendTodo(newTodo);
    });

    client.on('toggle', (data) => {
        const todo = DB.find((item) => item.id == data.id );
        todo.complete = !todo.complete;
        events.toggleTodo(todo);
    });

    client.on('delete', (todoId) => {
        DB = DB.filter((item) => item.id != todoId)
        events.deleteTodo(todoId);
    });

    // Send the DB downstream on connect
    client.emit('load', DB);
});

console.log('Waiting for clients to connect');
server.listen(3003);

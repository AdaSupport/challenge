const server = require('socket.io')();
const DB = require('./db');
const Todo = require('./todo');
const events = require('./events')(server);

server.on('connection', (client) => {
    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        events.reloadTodos();
    });

    // Send the DB downstream on connect
    events.reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

const server = require('socket.io')();
const fs = require('fs');
const todoPath = './data.json';
const firstTodos = require(todoPath);
const Todo = require('./todo').todo;

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    // Sends a message to the client to prepend new todo
    const prependTodo = (todo) => {
        server.emit('prepend', todo);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.unshift(newTodo);
        fs.writeFile(todoPath, JSON.stringify(DB, null, 4), function (err) {
            if (err) console.log(err);
        });

        // Send the latest todos to the client
        prependTodo(newTodo);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

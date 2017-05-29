// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

const express = require('express');
const app = express();
const path = require('path');


// viewed at http://localhost:8080
app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(3000);


server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

// Setup: Sockets io and express server
const express = require('express');
const app = express();
const server = require('http').createServer(app); /// changed line
const io = require('socket.io')(server);

const firstTodos = require('./data');
const Todo = require('./todo');

// Sends index.html to client's browser
app.use(express.static(__dirname + '/public'));

server.listen(3003);
console.log('Waiting for clients to connect');

// On connection to sockets server
io.on('connection', (client) => {
    console.log('Client connected');

    client.on('join', function(data) {
        console.log(data);

    });
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        client.emit('load', DB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});




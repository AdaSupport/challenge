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
    let DB_index_count = 0;   //keeps track of DB_Index
    let DB_initial_count = 0;
    console.log('Client connected');

    client.on('join', function(data) {
        console.log(data);

    });
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        DB_index_count ++;
        DB_initial_count ++;
        console.log("My DB_index_count:", DB_index_count);
        // Form new Todo objects
        return new Todo(title=t.title);

    });

    // Sends a message to the client to reload all todos
    // Sending all to-dos for a first time connecting client
    // Else
    const reloadTodos = () => {
        if(DB_index_count < DB_initial_count + 1){
            client.emit('load', DB);
        } else {
            client.broadcast.emit('load', DB[DB_index_count-1]);
            client.emit('load', DB[DB_index_count-1]);
        }

        DB_index_count ++;
        console.log("My DB_index_count:", DB_index_count);

    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);


        // Send the latest todos to the client
        reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
    client.on('disconnect', () => {
        console.log('disconnected client');
        DB_index_count = 0;
        DB_initial_count =0;
        console.log("My DB_index_count:", DB_index_count);
    });
});





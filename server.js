// FIXME: Feel free to remove this :-)
// console.log('\n\nGood Luck! 😅\n\n');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// custom imports
const firstTodos = require('./data');
const Todo = require('./todo');


// Express server
app.use('/', express.static(__dirname + '/'));

app.get('/', (res, req) => {
    res.sendFile(__dirname + 'index.html');
});

io.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    console.log('server connected');

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        // TypeError: Todo is not a function
        return new Todo(title=t.title);
    });

    // Assign todos to DB
    var todos = DB;

    console.log(todos);

    client.on('join', () => {
        console.log('client connected');
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', todos);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        todos.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

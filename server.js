// FIXME: Feel free to remove this :-)
//console.log('\n\nGood Luck! 😅\n\n');

const http = require('http');
const server = require('socket.io')(http);
const firstTodos = require('./data');
const Todo = require('./todo.js');
const fs = require('fs');
var clients = [];


server.on('connect', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    clients.push(client);
    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const loadNew = (newEntry) => {
        let json = JSON.stringify(DB);
        console.log(json);
        fs.writeFile('data.json', json, 'utf8', function(){
            console.log("data.json updated.");
        });
        server.emit('loadSingular',newEntry);
    }

    // Accepts when a client makes a new todo
    client.on('completed', (t) => {
        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        server.emit('completed',t);
    });

    client.on('deleted', (t) => {
        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        server.emit('deleted',t);
    });


    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        loadNew(newTodo);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

// Setup: Sockets io and express server
const express = require('express');
const app = express();
const server = require('http').createServer(app); /// changed line
const io = require('socket.io')(server);

const _ = require('lodash');

const firstTodos = require('./data');
const Todo = require('./todo');

// // Sends index.html to client's browser
// app.use(express.static(__dirname + '/public'));

server.listen(3003);
console.log('Waiting for clients to connect');

// ---- Server on DB Memory initialize
//keeps track of DB_Index
let DB_index_count = 0;
// This is going to be our fake 'database' for this application
// Parse all default Todo's from db

// FIXED:DB not reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
const DB = firstTodos.map((t) => {
    DB_index_count ++;
    // console.log("My DB_index_count:", DB_index_count);
    // Form new Todo objects
    return new Todo(task=t.task, isCompleted=t.isCompleted);

});




// On connection to sockets server
    io.on('connection', (client) => {
    console.log('Client connected');

    client.on('join', function(data) {
        console.log(data);

    });
    let onConnect = true;

    // Sends a message to the client to reload all todos
    // Sending all to-dos for a first time connecting client
    // Else send out the new to-do created
    const reloadTodos = () => {

        if(onConnect){
            client.emit('load', DB);
            onConnect = false;
        } else {
            DB_index_count ++;
            client.broadcast.emit('load', DB[DB_index_count-1]);
        }
        // console.log("My DB_index_count:", DB_index_count);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(task=t.task, isCompleted=t.isCompleted);
        // Push this newly created todo to our database
        DB.push(newTodo);
        // Send the latest todos to the client
        reloadTodos();
    });

    // Accepts when a client updates task CONTENT
    client.on('taskUpdateContent', (t) => {
        // Update Content on DB
        const foundTodo = _.find(DB, todo => todo.task === t.oldTask);
        foundTodo.task = t.newTask;
        client.broadcast.emit('incomingtaskUpdateContent', t);
    });




    // Accepts when a client updates task STATUS
    client.on('taskUpdateStatus', (t) => {
       // Update Server on Memory DB with task Completed Change
       const foundTodo = _.find(DB, todo => todo.task === t.task);
       foundTodo.isCompleted = t.isCompleted;
       // Brodcast to other clients that they need to update task status
       client.broadcast.emit('incomingtaskUpdateStatus', foundTodo);
    });


    // Accepts when a client deletes Task
    client.on('taskDelete', (t) => {
       // console.log('I want to delete', t);
       _.remove(DB, todo => todo.task === t.task);
       client.broadcast.emit('incomingtaskDelete', t.task);
       DB_index_count --;
    });

    // Send the DB downstream on connect
    reloadTodos();
    client.on('disconnect', () => {
        console.log('disconnected client');
        // console.log("My DB_index_count:", DB_index_count);
    });
});





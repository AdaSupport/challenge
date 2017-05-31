const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

const express = require('express');
const app = express();
const path = require('path');
const Immutable = require('immutable')


app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(3000);

let DB = firstTodos.map((t) => {
    return new Todo(t.title);
});


server.on('connection', (client) => {

    const appendTodo = (todo) =>{
        server.emit('append', todo);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(t.title);

        // Send the latest todos to the client
        appendTodo(newTodo);
    });

    client.on('remove', (index) => {
        server.emit('remove', index);
    });

    client.on('removeAll', () => {
        server.emit('removeAll');
    });

    client.on('undoRemove', () => {
        server.emit('undoRemove');
    });

    client.on('setDB', (todos)=>{
        DB =  Immutable.List(todos).toArray();
    });

    client.on('setCheck', (index) => {
        server.emit('setCheck', index);
    });

    server.emit('load', DB);

});

console.log('Waiting for clients to connect');

server.listen(3003);

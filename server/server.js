const socketIOServer = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('../models/todo');

const express = require('express');
const expressServer = express();
const path = require('path');
const Immutable = require('immutable')


let DB = firstTodos.map((t) => {
    return new Todo(t.title);
});

socketIOServer.on('connection', (client) => {

    const appendTodo = (todo) =>{
        socketIOServer.emit('append', todo);
    }

    // Accepts when a client makes a new todo
    client.on('append', (t) => {
        // Make a new todo
        const newTodo = new Todo(t.title);

        // Send the latest todos to the client
        appendTodo(newTodo);
    });

    client.on('remove', (index) => {
        socketIOServer.emit('remove', index);
    });

    client.on('removeAll', () => {
        socketIOServer.emit('removeAll');
    });

    client.on('undoRemove', () => {
        socketIOServer.emit('undoRemove');
    });

    client.on('setDB', (todos)=>{
        DB =  Immutable.List(todos).toArray();
    });

    client.on('setCheck', (index) => {
        socketIOServer.emit('setCheck', index);
    });

    client.on('getDB', () => {
        socketIOServer.emit('getDB', DB);
    });

    socketIOServer.emit('load', DB);

});

expressServer.use('/', express.static(path.join(__dirname, '../', 'dist')))


module.exports={
    expressServer:expressServer,
    socketIOServer:socketIOServer
}



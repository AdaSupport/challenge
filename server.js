// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const firstTodos = require('./data');
const Todo = require('./todo');
let DB = require('./DB');
const guid = require('./guid');
const path = require('path');
const methods = require('./DB-methods');
server.listen(3003);


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/css')));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (client) => {

    // // Accepts when a client makes a new todo
    client.on('make', (todo) => {
        const newTodo = methods.make(todo);
        io.emit('addNew', newTodo);
    });

    client.on('delete', (todo) => {
        console.log('receiving delete single function;')
        methods.remove(todo);
        io.emit('delete', todo);
    });

    client.on('markComplete', (todo) => {
        const completeItem = methods.complete(todo);
        client.broadcast.emit('complete', completeItem);
    });

    client.on('markIncomplete', (todo) => {
        const incompleteItem = methods.incomplete(todo);
        client.broadcast.emit('incomplete', incompleteItem);
    });

    client.on('deleteAll', () => {
        methods.deleteAll();
        client.broadcast.emit('deleteAll');
        io.emit('deleteAll');
    });

    client.on('completeAll', () => {
        DB = methods.completeAll();
        io.emit('load', DB);
    });

    io.emit('load', DB);
    // reloadTodos();
});

console.log('Waiting for clients to connect');

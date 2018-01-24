// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const firstTodos = require('./data');
const Todo = require('./todo');
const DB = require('./DB');
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
    client.emit('news', {hello: 'world'});

    // // Accepts when a client makes a new todo
    client.on('make', (todo) => {
        const newTodo = methods.make(todo);
        client.broadcast.emit('addNew', newTodo);
    });

    client.on('delete', (todo) => {
        console.log('receiving delete single function;')
        methods.remove(todo);
        client.broadcast.emit('delete', todo);
    });

    // // Send the DB downstream on connect
    client.emit('load', DB);
    // reloadTodos();
});

console.log('Waiting for clients to connect');

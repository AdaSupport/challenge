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
    // client.emit('news', {hello: 'world'});

    // // Accepts when a client makes a new todo
    client.on('make', (todo) => {
        const newTodo = methods.make(todo);
        // client.broadcast.emit('addNew', newTodo);
        io.emit('addNew', newTodo);
    });

    client.on('delete', (todo) => {
        console.log('receiving delete single function;')
        methods.remove(todo);
        io.emit('delete', todo);
    });

    client.on('markComplete', (todo) => {
        const completeItem = methods.toggle(todo);
        // console.log(todo);
        io.emit('complete', completeItem);
    });

    client.on('markIncomplete', (todo) => {
        const incompleteItem = methods.toggle(todo);
        // console.log(todo);
        io.emit('markIncomplete', incompleteItem);
    });
    // client.on('toggle', (todo) => {
    //     const item = methods.toggleItem(todo);
    //     io.emit('toggledItem', item);
    // })
    client.on('deleteAll', () => {
        methods.deleteAll();
        client.broadcast.emit('deleteAll');
        io.emit('deleteAll');
    });

    client.on('completeAll', () => {
        methods.completeAll();
        io.emit('completeAll');
    });

    // // Send the DB downstream on connect
    io.emit('load', DB);
    // reloadTodos();
});

console.log('Waiting for clients to connect');

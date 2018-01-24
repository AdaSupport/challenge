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
// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
// const DB = firstTodos.map((t) => {
//     // Form new Todo objects
//     return new Todo(title=t.title);
// });

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/css')));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (client) => {
    client.emit('news', {hello: 'world'});
    // socket.on('more news', (data) => {
    //     console.log(data);
    // });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        client.emit('load', DB);
    }

    // // Accepts when a client makes a new todo
    client.on('make', (todo) => {
        const newTodo = methods.make(todo);
        // DB.push(newTodo);
        client.emit('addNew', newTodo);
    });

    client.on('delete', (todo) => {
        console.log('receiving delete single function;')
        DB = methods.remove(todo);
        // client.emit()
    });

    // // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');

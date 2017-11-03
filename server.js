const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// TODO create database module
let counter = 0;
// Parse all default Todo's from db
const DB = firstTodos.reduce((map, todo) => {
  // Form new Todo objects
  map.set(counter, new Todo(counter, todo.title));
  counter++;
  return map;
}, new Map());

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        const todoList = new Array();
        DB.forEach((val, key, map) => todoList.push(val));
        client.emit('load', todoList);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(counter, title=t.title);
        counter++;

        // Add this newly created todo to our database
        DB[newTodo.id] = newTodo;

        // Sends the new todo to all clients
        server.emit('new', newTodo);
    });

    client.on('update', (t) => {
        DB[t.id] = t;
        server.emit('updated-todo', t);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

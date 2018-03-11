const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const express = require('express');
const clientPath = path.join(__dirname, '../build');
const {Database} = require('../server/db');

const DB = new Database();
DB.connect();

const app = express();
app.use(express.static(clientPath));


const server = http.createServer(app);


const io = socketIO(server);

io.on('connection', (client) => {
    // // This is going to be our fake 'database' for this application
    // // Parse all default Todo's from db

    // // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    // // const DB = firstTodos.map((t) => {
    // //     // Form new Todo objects
    // //     return new Todo(title=t.title);
    // // });

    // // Sends a message to the client to reload all todos
    const reloadTodos = () => {
      const todos = DB.getAllTodos();
      
      // io.emit('load', todos.map(({title, id})=>{return {title,id}}));
      io.emit('load', todos);
    }

    // // Accepts when a client makes a new todo
    // client.on('make', (t) => {
    //     // Make a new todo
    //     // const newTodo = new Todo(title=t.title);

    //     // Push this newly created todo to our database
    //     DB.insertOne(t.title);

    //     // Send the latest todos to the client
    //     // FIXME: This sends all todos every time, could this be more efficient?
    //     reloadTodos();
    // });

    // // Send the DB downstream on connect
    reloadTodos();
    console.log('connected');
});

server.listen(3001, ()=> {
  console.log('Waiting for clients to connect');
  // io.listen(3003);
})

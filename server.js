const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((t) => {
    // Form new Todo objects      
    return new Todo(title = t.title);
});

// Sends a message to the client to reload all todos
const loadTodos = () => {
    server.emit('load', DB);
}

const refresh = (t) => {
    server.emit('refresh', t);
}

server.on('connection', (client) => {
    // Send the DB downstream on connect
    loadTodos();

    // Accepts when a client makes a new todo
    client.on('addTask', (t) => {
        // Make a new todo
        const newTodo = new Todo(title = t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        console.log(DB)
        // Send the new todo to the client
        refresh([newTodo]);
    });
});

console.log('Waiting for clients to connect');
server.listen(3003);


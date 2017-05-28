const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

const DB = firstTodos.map((todo) => new Todo(todo.title));

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // Sends a message to the client to reload all todos
    const reloadTodos = (todoArray) => {
        server.emit('load', todoArray);
    };

    // Accepts when a client makes a new todo
    client.on('make', (todo) => {

        const newTodo = new Todo(todo.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        reloadTodos(DB);
    });

    // Send the DB downstream on connect
    reloadTodos(DB);
});


console.log('Waiting for clients to connect');
server.listen(3003);

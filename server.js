const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((todo) => {
    // Form new Todo objects
    return new Todo(title=todo.title, done=todo.done);
});

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const pushSingleTodo = (todo) => {
        server.emit('todo', todo);
    }

    const updateTodo = (index) => {
        server.emit('update', {index, todo: DB[index]});
    }

    // Accepts when a client makes a new todo
    client.on('make', (todo) => {
        // Make a new todo
        const newTodo = new Todo(title=todo.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        pushSingleTodo(newTodo);
    });

    client.on('toggleCompletionStatus', (index) => {
        DB[index].done = !DB[index].done;
        updateTodo(index);
    });

    client.on('remove', (index) => {
        DB.splice(index, 1);
        reloadTodos();
    })

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

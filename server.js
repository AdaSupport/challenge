const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = firstTodos.map(t => {
    return new Todo(t.title);
});

const reloadTodos = () => {
    server.emit('load', DB);
}

const createTodo = (response) => {
    const newTodo = new Todo(response.title);
    DB.push(newTodo);

    // Timeout to simulate delayed response
    setTimeout(() => { 
        postTodo(newTodo); 
    }, 3000);
}

const postTodo = (newTodo) => {
    server.emit('post', newTodo);
}

const deleteTodo = (response) => {
    DB = DB.filter(function(t) {
        return t.id !== response.todo.id;
    });

    server.emit('delete', response.todo.id);
}

const updateTodo = (response) => {
    DB.forEach((t, i) => {
        if (t.id === response.todo.id) {
            DB[i] = response.todo;
        }
    });

    server.emit('update', response.todo);
}

server.on('connection', (client) => {

    // Accepts when a client makes a new todo
    client.on('make', response => {
        createTodo(response);
    });

    // Accepts when a client deletes a new todo
    client.on('delete', response => {
        deleteTodo(response);
    });

    // Accepts when a client updates a new todo
    client.on('update', response => {
        updateTodo(response);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);


module.exports = {
    server,
    postTodo,
    deleteTodo,
    createTodo,
    DB
}

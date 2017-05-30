const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = firstTodos.map(todo => new Todo(todo.title));

server.on('connection', (client) => {

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
        reloadTodos(DB);
    });

    client.on('check', (isCheckedTodos) => {

        const changedTodoIds = isCheckedTodos.map(t => t.id);

        DB = DB.map(todo => changedTodoIds.includes(todo.id)
            ? (new Todo(todo.title, isCheckedTodos.find(t => t.id === todo.id).isChecked, todo.id))
            : todo);

        reloadTodos(DB);
    });

    client.on('delete', (ids) => {
        DB = DB.filter(todo => !ids.includes(todo.id));

        reloadTodos(DB);
    });

    // Send the DB downstream on connect
    reloadTodos(DB);
});

console.log('Waiting for clients to connect');
server.listen(3003);

const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

//Moved out of connection to prevent DB updating on client refresh
let DB = firstTodos.map(todo => new Todo(todo.title));

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = (todoArray) => {
        server.emit('load', todoArray);
    };

    // Accepts when a client makes a new todo
    client.on('make', (todo) => {

        const newTodo = new Todo(todo.title);

        // Adds new todo to DB
        DB.push(newTodo);

        // Sends the latest todos to client
        reloadTodos(DB);
    });

    //Accepts when client checks a todo or checks all todos
    client.on('check', (isCheckedTodos) => {

        const changedTodoIds = isCheckedTodos.map(t => t.id);

        //Updating DB isChecked property so checked todos persist
        DB = DB.map(todo => changedTodoIds.includes(todo.id)
            ? (new Todo(todo.title, isCheckedTodos.find(t => t.id === todo.id).isChecked, todo.id))
            : todo);

        reloadTodos(DB);
    });

    //Accepts when client deletes a todo or deletes all todos
    client.on('delete', (ids) => {
        //Updates DB with deleted todos removed
        DB = DB.filter(todo => !ids.includes(todo.id));

        reloadTodos(DB);
    });

    // Send the DB downstream on connect
    reloadTodos(DB);
});

console.log('Waiting for clients to connect');
server.listen(3003);

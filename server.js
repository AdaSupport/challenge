// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');
const DB = require('./DB');
const guid = require('./guid');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
// const DB = firstTodos.map((t) => {
//     // Form new Todo objects
//     return new Todo(title=t.title);
// });

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        const newTodo = new Todo(title=t.title, id=guid());

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        server.emit('addNew', newTodo);
        // reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

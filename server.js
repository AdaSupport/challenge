const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = firstTodos.map(t => {
    return new Todo(title=t.title);
});

server.on('connection', (client) => {

    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const postTodo = (newTodo) => {
        DB.push(newTodo);
        server.emit('post', newTodo);
    }

    const deleteTodo = (response) => {
        DB = DB.filter(function(t) {
            return t.id !== response.todo.id;
        });

        server.emit('delete', response.todo.id);
    }

    const updateTodo = (response) => {
        let todoRecord = DB.find(t => t.id === response.todo.id);
        todoRecord = response.todo
        server.emit('update', todoRecord);
    }

    // Accepts when a client makes a new todo
    client.on('make', t => {
        const newTodo = new Todo(title=t.title);

        // Timeout to simulate delayed response
        setTimeout(() => { 
            postTodo(newTodo); 
        }, 3000);
    });

    // Accepts when a client deletes a new todo
    client.on('delete', t => {
        deleteTodo(t);
    });

    // Accepts when a client updates a new todo
    client.on('update', t => {
        updateTodo(t);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);


// module.exports = {
//     test
// }

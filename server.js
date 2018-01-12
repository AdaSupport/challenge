const server = require('socket.io')();
const DB = require('./database');

server.on('connection', (client) => {

    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const pushSingleTodo = (todo) => {
        server.emit('todo', todo);
    }

    const updateTodo = (index) => {
        server.emit('update', {index, todo: DB[index]});
    }

    client.on('make', (todo) => {
        const newTodo = DB.add(todo);
        pushSingleTodo(newTodo);
    });

    client.on('toggleCompletionStatus', (index) => {
        DB.toggleCompletionStatus(index);
        updateTodo(index);
    });

    client.on('rename', (index, title) => {
        DB.renameTodo(index, title);
        updateTodo(index);
    })

    client.on('remove', (index) => {
        DB.remove(index);
        reloadTodos();
    });

    client.on('completeAll', () => {
        DB.completeAll();
        reloadTodos();
    });

    client.on('removeAll', () => {
        DB.removeAll();
        reloadTodos();
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

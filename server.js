const server = require('socket.io')();
const TodosCtrl = require('./todosCtrl').todosCtrl;

server.on('connection', (client) => {
    let ctrl = new TodosCtrl();

    // Accepts when a client makes a new todo
    client.on('createTodo', (t) => {
        const newTodo = ctrl.insertTodo(t);
        server.emit('prepend', newTodo); // Send the latest todos to the client
    });

    // Accepts when a client removes todo
    client.on('removeTodo', (id) => {
        if (ctrl.removeTodo(id))
            server.emit('remove', id);
    });

    // Accepts when a client removes all todos
    client.on('removeAll', () => {
        ctrl.removeAll();
        server.emit('removeAll');
    });
    
    // Accepts when a client checks todo item
    client.on('checkTodo', (id) => {
        if (ctrl.checkTodo(id))
            server.emit('check', id);
    });

    client.on('checkAll', () => {
        ctrl.checkAll();
        server.emit('checkAll');
    });

    // Send the DB downstream on connect
    server.to(client.id).emit('load', ctrl.getDB());
});

console.log('Waiting for clients to connect');
server.listen(3003);

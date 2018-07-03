const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

const DB = firstTodos.map((t) => {
    return new Todo(t.id, t.title, t.status);
});

let dbUpdatedTimeStamp = Date.now();

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', {db: DB, oldTS:null, currentTS: dbUpdatedTimeStamp, status: 'Add'});
    };

    // Accepts when a client makes a new todo
    client.on('service', (t) => {
        if(t.service == 'Add'){
            // Push this newly created todo to our database
            const newTodo = new Todo(DB.length+1, title=t.record.title);
            DB.push(newTodo);
            let oldTS = dbUpdatedTimeStamp;
            dbUpdatedTimeStamp = Date.now();
            server.emit('load', {db: [newTodo], oldTS:oldTS, currentTS: dbUpdatedTimeStamp, status: 'Add'});
        }
    });

    reloadTodos();
});
server.listen(3003);

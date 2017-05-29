const io = require('socket.io')();
const firstTodos = require('./data');
const port = 3003;

console.log(firstTodos);
const DB = firstTodos.slice();

io.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    console.log('connected!');

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    client.on('load', (data) => {
        console.log('joining room');
        console.log(data);
        client.join(data.room);
    })
    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        io.emit('load', DB);
        console.log('called');
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        console.log(t);

        client.broadcast.to(t.room).emit('receive item', t);
        // Push this newly created todo to our database
        DB.push({title: t.newItem});

        // // Send the latest todos to the client
        // // FIXME: This sends all todos every time, could this be more efficient?
        // reloadTodos();
    });

    // send the updated db to other clients 
    client.emit('update', DB);

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
io.listen(3003);
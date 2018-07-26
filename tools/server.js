const io = require('socket.io')();
const firstTodos = require('./data');
const port = 3003;
const fs = require('fs');

let DB = firstTodos.slice();

io.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    console.log('connected!');
    
    // FUNCTIONS
    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        io.emit('load', DB);
    }
    // Saves data file on disconnect
    const disconnect = () => {
        console.log('disconnected');
        jsonDB = JSON.stringify(DB);
        fs.writeFile('data.json', jsonDB, (err) => {
            if (err) {console.log(err)};
            console.log('saved');
        })
    }

    // Handles making a new todo
    const makeTodo = (data) => {
        client.broadcast.to(data.room).emit('receive item', data);
        DB.push({title: data.newItem});
    }

    // Handles deleting a todo
    const deleteTodo = (data) => {
        client.broadcast.to(data.room).emit('delete item', data);
        DB.splice(DB.findIndex((item) => {
            return item.title === data.title;
        }), 1)
    }

    // handles general use updates (complete all, delete all, completing a todo)
    const update = (data) => {
        client.broadcast.to(data.room).emit('update', data);
        DB = data.todos;
    }

    // LISTENERS
    // Write DB to file on client disconnect
    client.on('disconnect', () => {
        disconnect();
    })

    // Handle room joining 
    client.on('load', (data) => {
        client.join(data.room);
    })

    // Accepts when a client makes a new todo
    client.on('make', (data) => {
        makeTodo(data);
    });

    // Accepts deletion of an item
    client.on('delete item', (data) => {
        deleteTodo(data);
    });

    // Handles generic updates
    client.on('update', (data) => {
        update(data);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
io.listen(3003);


const io = require('socket.io')();
const firstTodos = require('./data');
const port = 3003;
const fs = require('fs');

let DB = firstTodos.slice();

io.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    console.log('connected!');

    // Write DB to file on client disconnect
    client.on('disconnect', () => {
        console.log('disconnected');
        jsonDB = JSON.stringify(DB);
        fs.writeFile('data.json', jsonDB, (err) => {
            if (err) {console.log(err)};
            console.log('saved');
        })
    })

    client.on('load', (data) => {
        client.join(data.room);
    })
    
    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        io.emit('load', DB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        client.broadcast.to(t.room).emit('receive item', t);
        DB.push({title: t.newItem});
    });

    // Accepts deletion of an item
    client.on('delete item', (t) => {
        client.broadcast.to(t.room).emit('delete item', t);
        DB.splice(DB.findIndex((item) => {
                return item.title === t.title;
            }), 1
        )
    });

    // Handles generic updates
    client.on('update', (t) => {
        client.broadcast.to(t.room).emit('update', t);
        DB = t.todos;
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
io.listen(3003);
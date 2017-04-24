const server = require('socket.io')();
const fs = require('fs');
const todoPath = './data.json';
const Todo = require('./todo').todo;
var MAX_ID = 0;

// Reads data from DB
let readDB = () => {
    let data = fs.readFileSync(todoPath, 'utf8');
    return JSON.parse(data);
}

server.on('connection', (client) => {
    let firstTodos = readDB();
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        if (t._id > MAX_ID) MAX_ID = t._id;
        return new Todo(id=t._id, title=t.title);
    });

    // Sends a message to the client to reload all todos
    const loadTodos = () => {
        server.to(client.id).emit('load', DB);
    }

    // Sends a message to the client to prepend new todo
    const prependTodo = (todo) => {
        server.emit('prepend', todo);
    }

    // Saves todo DB
    const saveDB = () => {
        fs.writeFile(todoPath, JSON.stringify(DB, null, 4), function (err) {
            if (err) console.log(err);
        });
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(id=++MAX_ID, title=t.title);

        // Push this newly created todo to our database
        DB.unshift(newTodo);
        saveDB();

        // Send the latest todos to the client
        prependTodo(newTodo);
    });

    // Send the DB downstream on connect
    loadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

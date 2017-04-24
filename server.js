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
    var DB = firstTodos.map((t) => {
        // Form new Todo objects
        if (t._id > MAX_ID) MAX_ID = t._id;
        return new Todo(id=t._id, title=t.title, isChecked = t.isChecked);
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

    // Removes todo by id
    const removeTodo = (id) => {
        var idx = -1;
        DB.every(function(todo, index) {
            if (todo._id == id) {
                idx = index;
                return false;
            }
            return true;
        });

        if (idx > -1) {
            DB.splice(idx, 1);
            saveDB();
            return true;
        }

        return false;
    }

    // Removes all items
    const removeAll = () => {
        DB = [];
        saveDB();
    }

    // Checks todo item by id
    const checkTodo = (id) => {
        var isChecked = false;
        DB.every(function(todo) {
            if (todo._id == id) {
                todo.isChecked = !todo.isChecked;
                isChecked = true;
                return false;
            }
            return true;
        });
        saveDB();
        return isChecked;
    }

    // Checks all items
    const checkAll = () => {
        DB.forEach((todo) => todo.isChecked = true);
        saveDB();
    };

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

    // Accepts when a client removes todo
    client.on('remove', (id) => {
        if (removeTodo(id))
            server.emit('remove', id);
    });

    // Accepts when a client removes all todos
    client.on('removeAll', () => {
        removeAll();
        server.emit('removeAll');
    });
    
    // Accepts when a client checks todo item
    client.on('check', (id) => {
        if (checkTodo(id))
            server.emit('check', id);
    });

    client.on('checkAll', () => {
        checkAll();
        server.emit('checkAll');
    });

    // Send the DB downstream on connect
    loadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);

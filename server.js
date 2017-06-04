// FIXME: Feel free to remove this :-)
// console.log('\n\nGood Luck! 😅\n\n');

// use express instead
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// custom imports
const firstTodos = require('./data');
const Todo = require('./todo');

// FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
// FIXED: Now persistent on new client connections, I think
const DB = firstTodos.map((t) => {
    // Form new Todo objects
    // TypeError: Todo is not a function
    return new Todo(title=t.title, status='active');
});

// Hybrid of db and sessionStorage, foot print login system, auth token in Db

// Express server
app.use('/', express.static(__dirname + '/'));

app.get('/', (res, req) => {
    res.sendFile(__dirname + 'index.html');
});

io.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    console.log('server connected');

    

    // Assign todos to DB
    var todos = DB;

    // console.log(todos);

    client.on('join', () => {
        console.log('client connected');
    });

    // Sends a message to the client to reload all todos
    // Matched client socket var
    const reloadTodos = () => {
        client.emit('load', todos);
    }

    // Send the DB downstream on connect, reorder
    reloadTodos();

    // Accepts when a client makes a new todo
    // Mismatching vars
    client.on('make', (val) => {
        // Make a new todo
        const newTodo = new Todo();
        newTodo.title = val;
        newTodo.status = "active";

        // Push this newly created todo to our database
        todos.push(newTodo);

        

        const addTodo = () => {
            client.emit('addTodo', newTodo);
            console.log(newTodo);
        }

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient? Yes
        // reloadTodos();
        addTodo();
    });

    

    client.on('status', (todo) => {
        // console.log(todos);
        // todo.status = status;

        const updateTodo = () => {
            // console.log(todo);
            // console.log(todos);
            // console.log(todos.indexOf(todo));
            // Can't use indexOf() on objects
            // var index = todos.indexOf(todo);
            // can't find todo in todos
            // Returns todo as item to be indexed
            // const findTodoByIndex = (todo) => {
            //     return todo;
            // }
            
            // var toodle = todos.findIndex(findTodoByIndex, todo.title);

            // Returns only the first toodle index
            // console.log(toodle);
            // Updates current todo status
            // todos[toodle].status = todo.status;
            // Check if its actually sending the right todo
            // console.log(todos[toodle]);
            // check if the status is being selected and switched
            // console.log(todos[toodle].status);
            // todos[toodle].todo.status = status;

            // Return index in todos of current todo
            const index = todos.map((todo) => {return todo.title}).indexOf(todo.title);

            console.log(index);

            // change todo status
            todos[index].status = todo.status;

            console.log(todos[index].status);

        }
        updateTodo();
        // console.log(todos[todo]);
        // todos[todo].status = status;

        
        // Shouldn't reload todos, just update status of selected todo
    }); 

    client.on('remove', (todo) => {
        // Needs declaration of the selected item, just removes last item right now
        console.log(todo);

        // Return index in todos of current todo
        const index = todos.map((todo) => {return todo.title}).indexOf(todo.title);

        console.log(index);

        // Finds todo at the right index and removes it, currently returning undefined, need to separate these two
        todos.splice(index, 1);
        
        reloadTodos();
    });

    
});

console.log('Waiting for clients to connect');
// server check
server.listen(3003, () => {
    console.log('listening on port 3003');
});

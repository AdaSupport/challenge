// FIXME: Feel free to remove this :-)
//console.log('\n\nGood Luck! 😅\n\n');

const http = require('http');
const server = require('socket.io')(http);
const Todo = require('./todo.js');
const fs = require('fs');


server.on('connection', (client) => {
    const firstTodos = require('./data');
    delete require.cache[require.resolve('./data')]
    var DB = [];
    var completed = [];
    var deleted = [];

    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db
    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    DB = firstTodos.tasks.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    completed = firstTodos.completed.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    deleted = firstTodos.deleted.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = (DB,completed,deleted) => {
        server.emit('load', {
            "tasks": DB,
            "completed": completed,
            "deleted": deleted
        });
    }

    const loadNew = (newEntry) => {
        server.emit('loadSingular',newEntry);
    }

    // Accepts when a client makes a new todo
    client.on('completed', (t) => {
        const newTodo = new Todo(title=t.title);
        DB.splice(DB.indexOf(t),1);
        // Push this newly created todo to our database
        completed.push(newTodo);


        server.emit('completed',t);
    });

    client.on('deleted', (t) => {
        const newTodo = new Todo(title=t.title);
        DB.splice(DB.indexOf(t),1);
        // Push this newly created todo to our database
        deleted.push(newTodo);

        server.emit('deleted',t);
    });


    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        loadNew(newTodo);
    });

    client.on('save', (t) => {
        let json = JSON.stringify({
            "tasks": DB,
            "completed": completed,
            "deleted": deleted
        });
        fs.writeFile('data.json', json, 'utf8', function(){
            console.log("data.json updated.");
        });
    });

    client.on('newSpace', () => {
        DB = new Array();
        completed = new Array();
        deleted = new Array();
        reloadTodos(DB,completed,deleted);
    });

    // Send the DB downstream on connect
    reloadTodos(DB,completed,deleted);
});

console.log('Waiting for clients to connect');
server.listen(3003);


/*
{"tasks":[{"title":"Order more coffee from Pilot"},{"title":"Clean the coffee machine"},{"title":"Sweep the floor"},{"title":"Order a new display for Gordon"},{"title":"Fix the charger for the speaker"},{"title":"Finish making the hiring challenge"},{"title":"hello"},{"title":"hi"},{"title":"somethingsomethingsomething"},{"title":"dwqdqwd"},{"title":"dwqd"},{"title":"dqwdjbgghtreg"},{"title":"fewnkjfwef"},{"title":"edfwnfkjwef"},{"title":"fenwkfjwkejnfkj"},{"title":"fewnkfejnwkefjn"},{"title":"das"},{"title":"dwdqwdkbfherj"},{"title":"dsad"},{"title":"dsad"},{"title":"dsad"}],"completed":[{"title":"Order more coffee from Pilot"},{"title":"dwdqwdkbfherj"},{"title":"dsad"}],"deleted":[{"title":"Order more coffee from Pilot"},{"title":"fenwkfjwkejnfkj"}]}
*/
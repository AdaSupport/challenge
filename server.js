// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

var i;

var counter=0;

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title, completed=t.completed);
    });


    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        //Creates an array of the uncompleted tasks
        var uncompletedDB = [];
        for(i=0;i<DB.length;i++){
            if(!DB[i].completed){
                uncompletedDB.push(DB[i]);
            }
        }
        //emit uncompleted tasks only
        server.emit('load', uncompletedDB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title, completed=false);

        // Push this newly created todo to our database
        DB.push(newTodo);

        //Updates data.json so that new users will load the all the updated todos from the DB
        firstTodos.push({
            title: t.title
        });

        // Send the latest todos to the client
        reloadTodos();
    });


    client.on('archive',(completedArray)=>{
        for(i=0;i<completedArray.length;i++){
            DB[completedArray[i]].completed = true;
        }
        reloadTodos();
    }); 





    // Send the DB downstream on connect
    reloadTodos();
    

});

console.log('Waiting for clients to connect');
server.listen(3003);

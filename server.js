// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

var i;

var counter=0;
var completedCounter=0;
var uncompletedDB = [];
server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t) => {

        //Account for how many tasks are already completed in the db
        if(t.completed){
            completedCounter++;
        }

        // Form new Todo objects
        return new Todo(title=t.title, completed=t.completed);
    });


    const initLoadTodos = () => {
        //Creates an array of the uncompleted tasks
        uncompletedDB=[];
        for(i=0;i<DB.length;i++){
            if(!DB[i].completed){
                uncompletedDB.push(DB[i]);
            }
        }

        //emit uncompleted tasks only
        server.emit('load', uncompletedDB);
    }

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        for(i=0;i<uncompletedDB.length;i++){
            if(uncompletedDB[i].completed){
                uncompletedDB.splice(i,1);
                i--;
            }
        }
        server.emit('load', uncompletedDB);
    }

    // Accepts when a client makes a new todo
    client.on('add', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title, completed=false);

        // Push this newly created todo to our database
        uncompletedDB.push(newTodo);

        //Updates data.json so that new users will load the all the updated todos from the DB
        firstTodos.push({
            title: t.title
        });

        // Send the latest todos to the client
        reloadTodos();
    });


    client.on('archive', (completedArray)=>{
        for(i=0;i<completedArray.length;i++){
            //client sends index of completed task from their list.
            //Must account for already completed tasks in the db

            uncompletedDB[completedArray[i]].completed = true;
            completedCounter++;
        }
        reloadTodos();
    }); 





    // Send the DB downstream on connect
    initLoadTodos();
    

});

console.log('Waiting for clients to connect');
server.listen(3003);

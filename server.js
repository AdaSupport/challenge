const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

var i;

var counter=0;
var firstLoadFlag = true;

var uncompletedDB = [];
server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db
    const DB = firstTodos.map((t) => {

        // Form new Todo objects
        return new Todo(title=t.title, completed=t.completed);
    });

    //emits on uncompleted tasks from data.json
    const initLoadTodos = () => {

        uncompletedDB=[];
        for(i=0;i<DB.length;i++){
            if(!DB[i].completed){
                uncompletedDB.push(DB[i]);
            }
        }
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
        const newTodo = new Todo(title=t.title, completed=false);
        uncompletedDB.push(newTodo);

        // Send the latest todos to the client
        reloadTodos();
    });

    //deletes todo item
    client.on('archive', (completedArray)=>{
        for(i=0;i<completedArray.length;i++){
            uncompletedDB[completedArray[i]].completed = true;
        }
        reloadTodos();
    }); 





    //Loads todo items from DB when loading page for the first time
    //Loads items from uncompleteDB when page refreshes
    if(firstLoadFlag){
        initLoadTodos();
        firstLoadFlag=false;
    } else {
        reloadTodos();
    }
    
    

});

console.log('Waiting for clients to connect');
server.listen(3003);

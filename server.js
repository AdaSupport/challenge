const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((t) => {
    // Form new Todo objects
    // this is to load the false field I added in data.json for testing.
    var myBool = false
    if (t.isComplete == 'true') myBool = true

    return new Todo(title = t.title, isComplete = myBool);
});

// Sends a message to the client to load all tasks
const loadTodos = () => {
    server.emit('load', DB);
}

// Sends a message to the client to update a task
const refresh = (t) => {
    server.emit('refresh', t);
}

server.on('connection', (client) => {
    console.log(client.id + " connected!")

    // Send the DB downstream on connect
    loadTodos();

    // Accepts when a client makes a new task
    client.on('addTask', (t) => {
        console.log("ADDED: " + t.title)

        // Make a new todo
        const newTask = new Todo(title = t.title, false);

        // Push this newly created task to our database
        DB.push(newTask);
 
        // Send the new task to the client
        refresh([newTask]);
    });

    // delete task from DB
    client.on('deleteTask', (updatedTask) => {
        var taskLabel = updatedTask.title;
        console.log("DELETED: " + taskLabel);

        // couldn't get DB filter to work, so I hacked this together...
        DB.splice(DB.findIndex((task) => {return (task.uuid == updatedTask.uuid);}), 1)
        //console.log(DB)

        loadTodos();
    });  

    // updates a task's completion status in DB
    client.on('completeTask', (updatedTask) => {
        var taskLabel = updatedTask.title;
        if (updatedTask.isComplete) console.log("COMPLETED: " + taskLabel);
        else console.log("UNCOMPLETED: " + taskLabel);

        DB.find((task) => { 
            if (task.uuid == updatedTask.uuid) 
            {
                task.isComplete = updatedTask.isComplete;
                refresh([task]);
            }
        });
    });  
});

console.log('Waiting for clients to connect');
server.listen(3003);

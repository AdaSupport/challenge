const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((t) => {
    // Form new Todo objects
    var myBool = false
    if (t.isComplete == 'true') myBool = true

    return new Todo(title = t.title, isComplete = myBool);
});


// Sends a message to the client to reload all todos
const loadTodos = () => {
    server.emit('load', DB);
    //console.log(DB)
}

const refresh = (t) => {
    server.emit('refresh', t);
}

server.on('connection', (client) => {
    console.log(client.id + " connected!")

    // Send the DB downstream on connect
    loadTodos();

    //server.emit('message', client.id + ' are connected!');
    //server.broadcast.emit('message', 'Another client has just connected!');

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

    client.on('deleteTask', (updatedTask) => {
        var taskLabel = updatedTask.title;
        console.log("DELETED: " + taskLabel);

        //deleteTask(taskLabel);
        // couldn't get DB filter to work, so I hacked this together...
        DB.splice(DB.findIndex((task) => {return (task.uuid == updatedTask.uuid);}), 1)
        //console.log(DB)

        loadTodos();
    });  

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

        //refresh([updatedTask])
        //updateTaskCompletion(taskLabel, updatedTask.isComplete);

        //loadTodos();
    });  
});

console.log('Waiting for clients to connect');
server.listen(3003);


// @deprecated utility functions
function deleteTask(taskLabel)
{
    for (var i = 0; i < DB.length; i++) {
        if (DB[i].title === taskLabel) {
            DB.splice(i--, 1);
        }
    }
}

function updateTaskCompletion(taskLabel, taskComplete)
{
    DB.forEach((task) => {
        if (task.title == taskLabel) task.isComplete = taskComplete;
    });
}


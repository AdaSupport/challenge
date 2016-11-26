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
}

const refresh = (t) => {
    server.emit('refresh', t);
}

server.on('connection', (client) => {
    // Send the DB downstream on connect
    loadTodos();

    // Accepts when a client makes a new todo
    client.on('addTask', (t) => {
        console.log("ADDED: " + t.title)

        // Make a new todo
        const newTodo = new Todo(title = t.title, false);

        // Push this newly created todo to our database
        DB.push(newTodo);
 
        // Send the new todo to the client
        refresh([newTodo]);
    });

    client.on('deleteTask', (updatedTask) => {
        console.log("DELETED: " + updatedTask.label);

        deleteTask(updatedTask.label);

        loadTodos();
    });  

    client.on('completeTask', (updatedTask) => {
        if (updatedTask.isComplete) console.log("COMPLETED: " + updatedTask.label);
        else console.log("UNCOMPLETED: " + updatedTask.label);

        updateTaskCompletion(updatedTask.label, updatedTask.isComplete);

        loadTodos();
    });  
});

console.log('Waiting for clients to connect');
server.listen(3003);


// utility functions

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


const Todo = require('./todo');
const firstTodos = require('./data');
// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((t) => {
    // Form new Todo objects
    return new Todo(title=t.title);
});


module.exports = DB;

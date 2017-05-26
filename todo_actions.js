let DB = require('./db');
const Todo = require('./todo');

module.exports = {
  make(t) {
    // Make a new todo
    const newTodo = new Todo(title=t.title);
    // Push this newly created todo to our database
    DB.push(newTodo);
    return newTodo;
  },

  toggle(data) {
    const todo = DB.find((item) => item.id == data.id );
    todo.complete = !todo.complete;
    return todo;
  },

  delete(todoId) {
    DB = DB.filter((item) => item.id != todoId);
  },

  deleteAll() {
    DB = [];
  },

  completeAll() {
    DB = DB.map((item) => Object.assign({}, item, {complete: true}));
  }
};

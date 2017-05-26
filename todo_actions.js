const DB = require('./db');
const Todo = require('./todo');

module.exports = {
  make(t) {
    // Make a new todo
    const newTodo = new Todo(title = t.title);
    // Push this newly created todo to our database
    DB.push(newTodo);
    return newTodo;
  },

  toggle(data) {
    const todo = DB.find(item => item.id == data.id);
    if (todo) {
      todo.complete = !todo.complete;
      return todo;
    }
  },

  delete(todoId) {
    const index = DB.findIndex((todo) => {
      todo.id == todoId;
    });

    if (index) {
      DB.splice(index, 1);
    }
  },

  deleteAll() {
    DB.splice(0, DB.length);
  },

  completeAll() {
    DB.forEach((todo) => {
      todo.complete = true;
    });
  },
};

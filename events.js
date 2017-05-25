const DB = require('./db');

module.exports = (server) => ({
  reloadTodos() {
    server.emit('load', DB);
  },

  sendTodo(todo) {
    server.emit('add', todo);
  },

  toggleTodo(todo) {
    server.emit('toggle', todo);
  },

  deleteTodo(todoId) {
    server.emit('delete', todoId);
  },

  deleteAllTodos() {
    server.emit('delete_all');
  },

  completeAllTodos() {
    server.emit('complete_all');
  }
});

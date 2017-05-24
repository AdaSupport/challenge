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
  }
});

// actions.js - this is where we will keep all our client actions for
// interacting with our server
var server = require('socket.io-client')('http://localhost:3003/')

// create new todo item
function create(title) {
  server.emit('make', {
    title: title,
  })
}

// Deletes and item
function deleteTodo(todo) {
  server.emit('delete', todo)
}

// delete all todo items
function deleteAll() {
  server.emit('deleteAll')
}

// Mark an item as complete
function complete(todo) {
  server.emit('markComplete', todo)
}

// mark all todo items as complete
function completeAll() {
  server.emit('completeAll')
}

// Mark an item as complete
function incomplete(todo) {
  server.emit('markIncomplete', todo)
}

module.exports = {
  create,
  deleteTodo,
  deleteAll,
  complete,
  completeAll,
  incomplete,
}

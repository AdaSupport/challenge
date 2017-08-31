var server = require('socket.io-client')('http://localhost:3003/')
var cache = require('./caching')
var { setupButtons, TodoItem } = require('./components')
const list = document.getElementById('todo-list')

// Server Events
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  list.innerHTML = '' // clear data on (re)load
  cache.saveDB(todos)
  todos.forEach(todo => render(todo))
})

// render the new todo item creted by the server
server.on('append', todo => {
  render(todo)
})

// When we can't connect, load from cache
server.on('connect_error', () => {
  list.innerHTML = ''
  cache.getDB().forEach(todo => render(todo))
})

setupButtons()

/** render - Append todo item to list element
  * @param {Todo} - a todo item
  */
function render(todo) {
  const listItem = TodoItem(todo)
  list.append(listItem)
}

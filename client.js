var server = require('socket.io-client')('http://localhost:3003/')
var {
  create,
  deleteTodo,
  deleteAll,
  complete,
  completeAll,
  incomplete,
} = require('./actions')
const list = document.getElementById('todo-list')

window.addEventListener(
  'load',
  function() {
    const createTodo = document.getElementById('createTodo')
    createTodo.onclick = add

    const completeAllBtn = document.createElement('button')
    completeAllBtn.innerHTML = 'complete all'
    completeAllBtn.onclick = completeAll
    document.body.appendChild(completeAllBtn)

    const deleteAllBtn = document.createElement('button')
    deleteAllBtn.innerHTML = 'delete all'
    deleteAllBtn.onclick = deleteAll
    document.body.appendChild(deleteAllBtn)
  },
  false
)

// Server Events

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  list.innerHTML = '' // clear data on (re)load
  todos.forEach(todo => render(todo))
})

server.on('append', todo => {
  render(todo)
})

// Global Functions

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
  const input = document.getElementById('todo-input')

  create(input.value)

  // Clear the input
  input.value = ''
  input.focus()
}

// Render one item
function _renderItem(todo) {
  const listItem = document.createElement('li')
  const listItemText = document.createTextNode(todo.title)
  const completeBtn = document.createElement('button')
  const listItemStatus = document.createTextNode(todo.completed)
  const deleteBtn = document.createElement('button')

  listItem.id = `id-${todo.id}`
  completeBtn.innerHTML = todo.completed ? 'mark incomplete' : 'complete'
  completeBtn.onclick = todo.completed
    ? function() {
        incomplete(todo)
      }
    : function() {
        complete(todo)
      }
  deleteBtn.innerHTML = 'delete'
  deleteBtn.onclick = function() {
    deleteTodo(todo)
  }

  listItem.appendChild(listItemText)
  listItem.appendChild(completeBtn)
  listItem.appendChild(listItemStatus)
  listItem.appendChild(deleteBtn)

  return listItem
}

// Append todo items to list element
function render(todo) {
  const listItem = _renderItem(todo)
  list.append(listItem)
}

var server = require('socket.io-client')('http://localhost:3003/')
var {
  create,
  deleteTodo,
  deleteAll,
  complete,
  completeAll,
  incomplete,
} = require('./actions')
var cache = require('./caching')
const list = document.getElementById('todo-list')

// Server Events
// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  list.innerHTML = '' // clear data on (re)load
  cache.saveDB(todos)
  todos.forEach(todo => render(todo))
})

server.on('append', todo => {
  render(todo)
})

server.on('connect_error', () => {
  list.innerHTML = '' // clear data on (re)load
  cache.getDB().forEach(todo => render(todo))
})

// DOM Manupilation
window.addEventListener(
  'load',
  function() {
    const createTodo = document.getElementById('createTodo')
    createTodo.onclick = add

    const completeAllBtn = document.getElementById('completeAll')
    completeAllBtn.onclick = completeAll

    const deleteAllBtn = document.getElementById('deleteAll')
    deleteAllBtn.onclick = deleteAll
  },
  false
)

// Global Functions

// This function adds a new todo from the input
function add() {
  const input = document.getElementById('todo-input')
  if (input.value === '') return
  create(input.value)
  // Clear the input
  input.value = ''
  input.focus()
}

// render our button to mark a todo as complete
function _renderCompleteButton(todo) {
  const completeBtn = document.createElement('button')
  completeBtn.classList.add('complete-button')
  // svg shamelessly stolen from asana
  completeBtn.innerHTML = `<svg class="Icon CheckIcon TaskRowCompletionStatus-checkIcon ${todo.completed &&
    'complete'}" title="CheckIcon" viewBox="0 0 32 32"> <polygon points="27.672,4.786 10.901,21.557 4.328,14.984 1.5,17.812 10.901,27.214 30.5,7.615 " /></svg>`
  completeBtn.onclick = todo.completed
    ? function() {
        incomplete(todo)
      }
    : function() {
        complete(todo)
      }

  return completeBtn
}

// Render one item
function _renderItem(todo) {
  const listItem = document.createElement('li')
  const listItemText = document.createElement('p')
  const deleteBtn = document.createElement('button')

  listItem.id = `id-${todo.id}`
  listItemText.innerHTML = todo.title
  listItemText.style.color = todo.completed ? '#a4a4a4' : '#333'
  deleteBtn.innerHTML = 'delete'
  deleteBtn.onclick = function() {
    deleteTodo(todo)
  }

  listItem.appendChild(_renderCompleteButton(todo))
  listItem.appendChild(listItemText)
  listItem.appendChild(deleteBtn)

  return listItem
}

// Append todo items to list element
function render(todo) {
  const listItem = _renderItem(todo)
  list.append(listItem)
}

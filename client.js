const server = io('http://localhost:3003/')
const list = document.getElementById('todo-list')

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

  // Emit the new todo as some data to the server
  server.emit('make', {
    title: input.value,
  })

  // Clear the input
  input.value = ''
  input.focus()
}

// Deletes and item
function deleteTodo(todo) {
  server.emit('delete', todo)
}

// Mark an item as complete
function complete(todo) {
  server.emit('markComplete', todo)
}

// Mark an item as complete
function incomplete(todo) {
  server.emit('markIncomplete', todo)
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

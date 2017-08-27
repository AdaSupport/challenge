const server = io('http://localhost:3003/')
const list = document.getElementById('todo-list')

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
  // TODO: refocus the element
}

function _renderItem(todo) {
  const listItem = document.createElement('li')
  const listItemText = document.createTextNode(todo.title)
  listItem.appendChild(listItemText)

  return listItem
}

function render(todo) {
  const listItem = _renderItem(todo)
  list.append(listItem)
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  list.innerHTML = '' // clear data on (re)load
  todos.forEach(todo => render(todo))
})

server.on('append', todo => {
  render(todo)
})

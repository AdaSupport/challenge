const server = require('socket.io')()
const firstTodos = require('./data')
const Todo = require('./todo')

// Sick "DB" bruh
// dis bitch is global now, yolo
const DB = []
let id = 0

// initialize deez nutty
for (let todo of firstTodos) {
  DB.push(new Todo(id, todo.title))
  id += 1
}

// NOTE: fires on all new client connections
server.on('connection', client => {
  // Dispatches an event to append an item to the end of our list
  const appendTodoItem = todo => {
    server.emit('append', todo)
  }

  // Actions from client ===
  // Accepts when a client makes a new todo
  client.on('make', t => {
    // Make a new todo
    const newTodo = new Todo(id, t.title)
    id += 1 // incerement id

    DB.push(newTodo)

    // Send the latest todos to the client
    appendTodoItem(newTodo)
  })

  client.on('markComplete', t => {
    for (var todo of DB) {
      if (todo.id === t.id) {
        todo.completed = true
        server.emit('load', DB) // HACK: Updates frontend. Shitty but works
        return
      }
    }
    console.error(`Todo item ${t.id} was not found. Could not mark complete`)
  })

  // on connect, load entire DB to just that client
  client.emit('load', DB)
})

console.log('Waiting for clients to connect')
server.listen(3003)

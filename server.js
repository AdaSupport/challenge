const server = require('socket.io')()
const firstTodos = require('./data')
const Todo = require('./todo')

// Sick "DB" bruh
// dis bitch is global now, yolo
const DB = []

firstTodos.map(t => {
  // Form new Todo objects
  return new Todo(t.title)
})

// initialize deez nutty
for (let todo of firstTodos) {
  DB.push(new Todo(todo.title))
}

// NOTE: fires on all new client connections
server.on('connection', client => {
  // Dispatches an event to append an item to the end of our list
  const appendTodoItem = todo => {
    server.emit('append', todo)
    //client.broadcast.emit('append', todo)
  }

  // Accepts when a client makes a new todo
  client.on('make', t => {
    // Make a new todo
    const newTodo = new Todo(t.title)

    // Push this newly created todo to our database
    DB.push(newTodo)

    // Send the latest todos to the client
    appendTodoItem(newTodo)
  })

  // on connect, load entire DB to just that client
  client.emit('load', DB)
})

console.log('Waiting for clients to connect')
server.listen(3003)

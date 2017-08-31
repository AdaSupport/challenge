const server = require('socket.io')()
const _ = require('lodash')
const firstTodos = require('./data')
const Todo = require('./todo')

// Sick "DB" bruh
// dis bitch is global now, yolo
let DB = []
let id = 0 // id to keep track of todo item ids

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

  /*=== Actions from client ===*/
  // Accepts when a client makes a new todo
  client.on('make', t => {
    // Make a new todo
    const newTodo = new Todo(id, t.title)
    id += 1

    DB.push(newTodo)

    // Send the latest todos to the client
    appendTodoItem(newTodo)
  })

  // Mark todo item t as completed
  client.on('markComplete', t => {
    updateCompleteStatus(t, true)
  })

  client.on('completeAll', () => {
    for (var todo of DB) {
      todo.completed = true
    }
    server.emit('load', DB) // HACK: Updates frontend. Shitty but works
  })

  // Mark todo item t as incomplete
  client.on('markIncomplete', t => {
    updateCompleteStatus(t, false)
  })

  // Remove todo item
  client.on('delete', t => {
    DB = _.remove(DB, todoItem => {
      return todoItem.id !== t.id
    })
    server.emit('load', DB) // HACK: Updates frontend. Shitty but works
  })

  // Delete all todo items
  client.on('deleteAll', () => {
    DB = []
    server.emit('load', DB) // HACK: Updates frontend. Shitty but works
  })

  // on connect, load entire DB to just that client
  client.emit('load', DB)
})

// Helper functions
function updateCompleteStatus(t, status) {
  for (var todo of DB) {
    if (todo.id === t.id) {
      todo.completed = status
      server.emit('load', DB) // HACK: Updates frontend. Shitty but works
      return
    }
  }
  console.error(`Todo item ${t.id} was not found. Could not mark complete`)
}

console.log('Waiting for clients to connect')
server.listen(3003)

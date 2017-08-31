const server = require('socket.io')()
const firstTodos = require('./data')
const db = require('./db')
const DB = new db(firstTodos)

// NOTE: fires on all new client connections
server.on('connection', client => {
  // Dispatches an event to append an item to the end of our list
  const appendTodoItem = todo => {
    server.emit('append', todo)
  }

  // Accepts when a client makes a new todo
  client.on('make', t => {
    const todo = DB.insert(t)
    appendTodoItem(todo)
  })

  client.on('markComplete', t => {
    DB.update(t, true, () => server.emit('load', DB.db))
  })

  client.on('completeAll', () => {
    for (var todo of DB.db) {
      DB.update(todo, true)
    }
    server.emit('load', DB.db) // HACK: Updates frontend. Shitty but works
  })

  client.on('markIncomplete', t => {
    DB.update(t, false, () => server.emit('load', DB.db))
  })

  client.on('delete', t => {
    DB.remove(t)
    server.emit('load', DB.db) // HACK: Updates frontend. Shitty but works
  })

  client.on('deleteAll', () => {
    DB.empty()
    server.emit('load', DB.db) // HACK: Updates frontend. Shitty but works
  })

  // on connect, load entire DB to just that client
  client.emit('load', DB.db)
})

console.log('Waiting for clients to connect')
server.listen(3003)

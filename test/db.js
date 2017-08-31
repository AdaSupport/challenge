var expect = require('expect.js')
const db = require('../db')
const Todo = require('../todo')

describe('When creating a new Database with default data', function() {
  let DB

  let todos = [
    {
      title: 'Order more coffee from Pilot',
      completed: false,
    },
    {
      title: 'Clean the coffee machine',
      completed: false,
    },
  ]

  before(function() {
    DB = new db(todos)
  })

  it('should contain the default data', function() {
    expect(DB.db).to.have.length(todos.length)
  })
})

describe('When creating a new Database with no default data', function() {
  let DB

  before(function() {
    DB = new db()
  })

  it('should be empty', function() {
    expect(DB.db).to.be.empty()
  })
})

describe('When we have a Database', function() {
  let DB

  let todos = [
    {
      title: 'Order more coffee from Pilot',
      completed: false,
    },
    {
      title: 'Clean the coffee machine',
      completed: false,
    },
  ]

  before(function() {
    DB = new db(todos)
  })

  describe('and we insert a todo', function() {
    let todo = { title: 'title' }

    it('should contain the new todo', function() {
      DB.insert(todo)
      expect(DB.db).to.have.length(todos.length + 1)
    })
  })
})

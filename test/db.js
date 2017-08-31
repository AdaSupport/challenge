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

  beforeEach(function() {
    DB = new db(todos)
  })

  describe('and we insert a todo', function() {
    let todo = { title: 'title' }

    it('should contain the new todo', function() {
      DB.insert(todo)
      expect(DB.db).to.have.length(todos.length + 1)
    })
  })

  describe('and we delete a todo', function() {
    let todo = { id: 1, title: 'Clean the coffee machine' }

    it('should not contain the new todo', function() {
      DB.remove(todo)
      expect(DB.db).to.have.length(todos.length - 1)
    })
  })

  describe('and we update a todo', function() {
    let todo = { id: 1, title: 'Clean the coffee machine' }

    it('should have updated the todo', function() {
      DB.update(todo, true)
      expect(DB.db).to.have.length(todos.length)
      expect(DB.db[1].completed).to.equal(true)
    })
  })
})

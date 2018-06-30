var expect = require('expect.js')
const Todo = require('../todo')

describe('When creating a new todo item', function() {
  let todo

  before(function() {
    todo = new Todo()
  })

  it('should have an id that is a number', function() {
    expect(todo.id).to.be.a('number')
  })

  it('should have an id that is above -1', function() {
    expect(todo.id).to.be.above(-1)
  })

  it('should have a title of empty string by default', function() {
    expect(todo.title).equal('')
  })

  it('should be not completed by default', function() {
    expect(todo.completed).equal(false)
  })
})

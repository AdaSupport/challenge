const expect = require('chai').expect;
const Todo = require('../todo').todo;

describe('todo-item', function() {
  const id = 123;
  const title = "123";

  it('should create new todo object', () => {
    const newTodo = new Todo(id);
    expect(newTodo.constructor.name).to.equal('Todo');
  });

  it('should create new todo object with id', () => {
    const newTodo = new Todo(id);
    expect(newTodo._id).to.equal(id);
  });

  it('should create new todo object with title', () => {
    const newTodo = new Todo(id, title);
    expect(newTodo.title).to.equal(title);
  });

  it('should create new todo object with unchecked status by default', () => {
    const newTodo = new Todo(id);
    expect(newTodo.isChecked).to.equal(false);
  });

  it('should create new todo object with checked status', () => {
    const newTodo = new Todo(id, title, true);
    expect(newTodo.isChecked).to.equal(true);
  });
});
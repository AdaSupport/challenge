const proxyquire =  require('proxyquire').noCallThru().noPreserveCache();
const Todo       = require('../todo');
let todoActions;


const testDB = [
  new Todo(title='foo'),
  new Todo(title='bar'),
  new Todo(title='baz')
];

describe("Todos actions", function() {
  let dbStub;

  beforeEach(function() {
    dbStub = testDB.slice();
    todoActions = proxyquire(
          '../todo_actions',
          { './db': dbStub }
    );
  });

  it("should create a single todo", function() {
    const todo = todoActions.make({title: 'Hello'});
    expect(todo.title).equal('Hello');
  });

  it("should toggle a given todo", function(){
    const todo = dbStub[0];
    todoActions.toggle(todo);
    expect(todo.complete).to.be.true;
  });

  it("should delete a single todo", function(){
    const todo = dbStub[0];
    const oldLength = dbStub.length;
    todoActions.delete(todo.id);
    expect(dbStub.length).equal(oldLength - 1);
  });

  it("should delete all todos", function() {
    todoActions.deleteAll();
    expect(dbStub.length).equal(0);
  });

  it("should complete all todos", function(){
    todoActions.completeAll();
    expect(
      dbStub.every((todo)=>todo.complete)
    ).to.be.true;
  });
});

const Todo = require('../todo');

describe('When creating a new todo', function(){
  var todo;

  before(function(){
    todo = new Todo();
  });

  it('should have empty title by default', function(){
    expect(todo.title).equal('');
  });

  it('should be not completed by default', function(){
    expect(todo.complete).equal(false);
  });

  it('should have an id assigned', function(){
    expect(todo.id).to.not.be.undefined;
  });

});

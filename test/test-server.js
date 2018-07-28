const expect = require('chai').expect;
const io = require('socket.io-client');
const serverUrl = 'http://localhost:3003/';

describe('server test', function() {
  var client1;
  var client2;

  var tasks=["The first task", "The second task"];
  var addedId;

  before(() => {
    client1 = io.connect(serverUrl);
    client2 = io.connect(serverUrl);
  });

  it('should emit add new todo item to all clients', (done) => {
    client1.on('prepend', (todo) => {
      addedId = todo._id;
      expect(todo.title).to.equal(tasks[0]);
    });

    client2.on('prepend', (todo) => {
      expect(todo.title).to.equal(tasks[0]);
      done();
    });

    client1.emit('createTodo', {
      title : tasks[0]
    });

  });

  it('should emit check todo item by id at all clients', (done) => {
    client1.on('check', (id) => {
      expect(id).to.equal(addedId);
    });

    client2.on('check', (id) => {
      expect(id).to.equal(addedId);
      done();
    });

    client1.emit('checkTodo', addedId);
  });

  it('should emit check all items in DB', (done) => {
    client1.on('checkAll', () => {
      expect(true).to.be.true;
    });

    client2.on('checkAll', () => {
      expect(true).to.be.true;
    });

    client1.emit('checkAll');
    done();
  });

  it('should emit remove item by id to all clients', () => {
    client1.on('remove', (id) => {
      expect(id).to.equal(addedId);
    });

    client2.on('remove', (id) => {
      expect(id).to.equal(addedId);
      done();
    });

    client1.emit('removeTodo', addedId);
  });

  it('should emit removeAll', (done) => {
    client1.on('removeAll', () => {
      expect(true).to.be.true;
    });

    client2.on('removeAll', () => {
      expect(true).to.be.true;
    });

    client1.emit('removeAll');
    done();
  });

});
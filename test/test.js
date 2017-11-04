const fs = require('fs');
const test = require('ava');
const database = require('../database');

test.afterEach.always(t => {
  if (t.context.delete) {
    fs.unlink(t.context.db_name, (err) => {
      return;
    });
  }
});

test('_load works if database is not found', t => {
  const db = new database('./test/data/not-found.json');
  t.is(db.counter, 0);
  t.is(db.todos.size, 0);
});

test('_load works if database is found', t => {
  const db = new database('./test/data/test.json');
  t.is(db.counter, 6);
  t.is(db.todos.size, 6);
});

test('_sync works correctly', t => {
  t.context.db_name = './test/data/new.json';
  t.context.delete = true;

  const db = new database(t.context.db_name, true);
  db.newTodo('test');
  const reloadDB = new database(t.context.db_name);
  t.is(reloadDB.counter, 1);
  t.deepEqual(reloadDB.todos.get(0), {title: 'test', id: 0, completed: false});
});

test.todo('update todo writes to disk');
test.todo('delete todo writes to disk');
test.todo('delete all todos writes to disk');

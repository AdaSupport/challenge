const fs = require('fs');
const data = require('./data');
const Todo = require('./todo');

class DB {
  constructor(_fileName='data.json', _syncWrites=false) {
    this.fileName = _fileName;
    this.syncWrites = _syncWrites;
    this.counter = 0;
    this.todos = new Map();
    this._load();
  }

  newTodo(title) {
    const newTodo = new Todo(this.counter, title);
    this.todos.set(this.counter, newTodo);
    this.counter++;
    this._sync();
    return newTodo;
  }

  updateTodo(todo) {
    this.todos.set(todo.id, todo);
    this._sync();
    return todo;
  }

  deleteTodo(todo) {
    this.todos.delete(todo.id);
    this._sync();
  }

  deleteAll() {
    this.todos.clear();
    this._sync();
  }

  completeAll() {
    this.todos.forEach((todo) => todo.completed = true);
    this._sync();
  }

  values() {
    const todoList = new Array();
    this.todos.forEach((todo) => todoList.push(todo));
    return todoList;
  }

  _load() {
    // sync read database from disk
    let data = null;
    try { data = fs.readFileSync(this.fileName); }
    catch (e) { return; }

    if (data != null) {
      data = JSON.parse(data);
      this.counter = data.counter;
      this.todos = new Map(data.map);
    }
  }

  _sync() {
    // async write database to disk
    const data = {
      counter: this.counter,
      map: Array.from(this.todos.entries())
    }
    if (this.syncWrites) {
      const err = fs.writeFileSync(this.fileName, JSON.stringify(data))
      if (err) throw err;
    } else {
      fs.writeFile(this.fileName, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    }
  }
}
module.exports = DB;

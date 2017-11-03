const fs = require('fs');
const data = require('./data');
const Todo = require('./todo');

class DB {
  constructor() {
    this.counter = 0;
    this.todos = new Map();
    this.init();
  }

  init() {
    this.counter = data.counter;
    this.todos = new Map(data.map);
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
    this._sync();
    return todoList;
  }

  _sync() {
    // async write database to disk
    const data = {
      counter: this.counter,
      map: Array.from(this.todos.entries())
    }
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  }
}
module.exports = DB;

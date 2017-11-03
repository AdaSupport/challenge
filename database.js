const firstTodos = require('./data');
const Todo = require('./todo');

class DB {
  constructor() {
    this.counter = 0;
    this.todos = new Map();
    this.init();
  }

  init() {
    firstTodos.map((todo) => this.newTodo(todo.title));
  }

  newTodo(title) {
    const newTodo = new Todo(this.counter, title);
    this.todos.set(this.counter, newTodo);
    this.counter++;
    return newTodo;
  }

  updateTodo(todo) {
    this.todos.set(todo.id, todo);
    return todo;
  }

  deleteTodo(todo) {
    this.todos.delete(todo.id);
  }

  deleteAll() {
    this.todos.clear();
  }

  completeAll() {
    this.todos.forEach((todo) => todo.completed = true);
  }

  values() {
    const todoList = new Array();
    this.todos.forEach((todo) => todoList.push(todo));
    return todoList;
  }
}
module.exports = DB;

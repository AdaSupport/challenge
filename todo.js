// todo.js - model for our todo items
module.exports = class Todo {
  constructor(id = 0, title = '') {
    this.id = id
    this.title = title
    this.completed = false
  }
}

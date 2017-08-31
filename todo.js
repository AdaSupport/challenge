// todo.js - model for our todo items
module.exports = class Todo {
  constructor(id, title = '') {
    this.id = id
    this.title = title
    this.completed = false
  }
}

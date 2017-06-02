const uuid = require('node-uuid');

module.exports = class Todo {
    constructor(title='', isCompleted=false) {
        this.title = title,
        this.id = uuid.v4(),
        this.isCompleted = isCompleted
    }
}

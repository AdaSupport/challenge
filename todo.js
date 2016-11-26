var uuid = require('uuid')

class Todo 
{
    constructor(title = '', isComplete = false) 
    {
        this.title = title
        this.uuid = uuid()
        this.isComplete = isComplete
    }
}

module.exports = Todo

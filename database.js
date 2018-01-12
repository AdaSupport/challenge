const fixtures = require('./data');

class Todo {
    constructor(title='', done) {
        this.title = title;
        this.done = !!done;
    }
}

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
class DB extends Array {

    add(todo) {
        const newTodo = new Todo(todo.title, todo.done);
        this.push(newTodo);
        return newTodo;
    }

    remove(index) {
        return this.splice(index, 1)[0];
    }

    toggleCompletionStatus(index) {
        if(!this[index]) return
        this[index].done = !this[index].done;
    }

    renameTodo(index, title) {
        if(!this[index]) return
        this[index].title = title;
        return this[index]
    }

    completeAll() {
        this.forEach(todo => todo.done = true);
    }

    removeAll() {
        this.splice(0, this.length);
    }

    get last() {
        return this[this.length-1]
    }

};

todos = fixtures.map((todo) => new Todo(todo.title, todo.done));
module.exports = DB.from(todos);

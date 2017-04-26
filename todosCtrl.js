const fs   = require('fs');
const Todo = require('./todo').todo;
var MAX_ID = 0;

module.exports.todosCtrl = class TodosCtrl {
    constructor() {
        this.todoPath = './data.json';
        this.DB       = this.__readDB();
    }

    getDB() {
        return this.DB;
    }

    checkTodo(id) {
        var isChecked = false;
        this.DB.every(function(todo) {
            if (todo._id == id) {
                todo.isChecked = !todo.isChecked;
                isChecked = true;
                return false;
            }
            return true;
        });
        this.__saveDB();
        return isChecked;
    }

    insertTodo(newTodoObj) {
        // Make a new todo
        const newTodo = new Todo(++MAX_ID, newTodoObj.title);

        // Push this newly created todo to our database
        this.DB.unshift(newTodo);
        this.__saveDB();
        return newTodo;
    }

    removeTodo(id) {
        var idx = -1;
        this.DB.every(function(todo, index) {
            if (todo._id == id) {
                idx = index;
                return false;
            }
            return true;
        });

        if (idx > -1) {
            this.DB.splice(idx, 1);
            this.__saveDB();
            return true;
        }

        return false;
    }

    removeAll() {
        this.DB = [];
        this.__saveDB();
    }

    checkAll() {
        this.DB.forEach((todo) => todo.isChecked = true);
        this.__saveDB();
    };

    __readDB() {
        let data = fs.readFileSync(this.todoPath, 'utf8');
        let parsedData = JSON.parse(data);
        return parsedData.map((t) => {
            // Form new Todo objects
            if (t._id > MAX_ID) MAX_ID = t._id;
            return new Todo(t._id, t.title, t.isChecked);
        });
    }

    __saveDB() {
        fs.writeFile(this.todoPath, JSON.stringify(this.DB, null, 4), function (err) {
            if (err) console.log(err);
        });
    }
}
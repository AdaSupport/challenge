// simple way to generate a new unique id
function ID () {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Todo {
    constructor(title='', id = ID(), completed=false) {
        this.title = title;
        //add id as the id of each todo
        this.id = id;
        //for showing completed status
        this.completed = completed;
        //for showing editing
        this.isEditing = false;
    }
}

module.exports.Todo = Todo;

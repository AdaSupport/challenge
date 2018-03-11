// simple way to generate a new unique id
function ID () {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Todo {
    constructor(title='', id) {
        this.title = title;
        //add time as the id of each todo
        this.id   = id || ID();
    }
}

module.exports = Todo

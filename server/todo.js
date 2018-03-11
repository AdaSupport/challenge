// simple way to generate a new unique id
function ID () {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Todo {
    constructor(title='', id) {
        this._title = title;
        //add time as the id of each todo
        this._id   = id || ID();
    }

    get id(){
      return this._id
    }

    get title(){
      return this._title
    }
}

module.exports = Todo

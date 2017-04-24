module.exports.todo = class Todo {
    constructor(id=0, title='') {
        this._id = id;
        this.title = title;
    }

    get id() {
      return this._id;
    }
}
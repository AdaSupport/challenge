module.exports.todo = class Todo {
    constructor(id, title='', isChecked=false) {
        this._id = id;
        this.title = title;
        this.isChecked = isChecked;
    }

    getId() {
      return this._id;
    }
}
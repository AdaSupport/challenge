module.exports.todo = class Todo {
    constructor(id=0, title='', isChecked=false) {
        this._id = id;
        this.title = title;
        this.isChecked = isChecked;
    }

    get id() {
      return this._id;
    }
}
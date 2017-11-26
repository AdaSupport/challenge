module.exports = class Todo {
    constructor(title='', done) {
        this.title = title;
        this.done = !!done;
    }
}

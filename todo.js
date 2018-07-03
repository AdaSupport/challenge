class Todo {
    constructor(id,title='', status='New') {
        this.id = id;
        this.title = title;
        this.status = status;
    }
}
module.exports = Todo;
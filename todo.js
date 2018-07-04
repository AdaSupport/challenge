class Todo {
    constructor(id=Math.floor((Math.random() * 100000000) + 1),title='', status='New') {
        this.id = id;
        this.title = title;
        this.status = status;
    }
}
module.exports = Todo;
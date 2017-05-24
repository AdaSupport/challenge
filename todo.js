const uuidV4 = require('uuid/v4');

module.exports = class Todo {
    constructor(title='') {
        this.id = uuidV4();
        this.title = title;
    }
}

var shortid = require('shortid');

module.exports = class Todo {
    constructor(title = '', isChecked = false, id = shortid.generate()) {
        this.title = title;
        this.isChecked = isChecked;
        this.id = id;
    }
};
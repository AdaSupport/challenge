const uuidV4 = require('uuid/v4');

module.exports = class Todo {
  constructor(title = '', complete = false) {
    this.id = uuidV4();
    this.title = title;
    this.complete = complete;
  }
};

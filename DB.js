// create the first DB from data in data.json
const Todo = require('./todo');
const firstTodos = require('./data');
const guid = require('./guid');

const DB = firstTodos.map(item => {
	return new Todo(title=item.title, id=guid());
});

module.exports = DB;
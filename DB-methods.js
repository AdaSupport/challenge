const DB = require('./DB');
const Todo = require('./todo');
const guid = require('./guid');

const make = (todo) => {
	const newTodo = new Todo(title=todo.title, id=guid());
    DB.push(newTodo);
    return newTodo;
}

const remove = (todo) => {
	const todoIndex = DB.findIndex(item =>
		item.id === todo.id
	)

	if(todoIndex !== 1) {
		DB.splice(todoIndex, 1);
	}
}

module.exports = {
	make,
	remove
}
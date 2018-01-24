let DB = require('./DB');
const Todo = require('./todo');
const guid = require('./guid');

const make = (todo) => {
	const newTodo = new Todo(title=todo.title, id=guid());
    DB.push(newTodo);
    return newTodo;
}

const remove = (todo) => {
	return DB.filter(item => item.id !== todo.id);
}

module.exports = {
	make,
	remove
}
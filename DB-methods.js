let DB = require('./DB');
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

const complete = (todo) => {
	for(var item of DB) {
		if(item.id === todo.id) {
			todo.complete = true;
		}
	}
	return todo;
}

const incomplete = (todo) => {
	for(var item of DB) {
		if(item.id === todo.id) {
			todo.complete = false;
		}
	}
	return todo;
}

const deleteAll = () => {
	DB = [];
	return DB;
}

const completeAll = () => {
	for(var todo of DB) {
		todo.complete = !todo.complete;
	}
	return DB;
}

module.exports = {
	make,
	complete,
	incomplete,
	remove,
	deleteAll,
	completeAll

}
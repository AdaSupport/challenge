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

// const toggleItem = (todo) => {
// 	for(var item of DB) {
// 		if(item.id === todo.id) {
// 			todo.complete = !todo.complete;
// 		}
// 	}
// 	return todo;
// }

const toggle = (todo) => {
	for(var item of DB) {
		if(item.id === todo.id) {
			todo.complete = !todo.complete;
		}
	}
	return todo;
}

// const incomplete = (todo) => {
// 	for(var item of DB) {
// 		if(item.id === todo.id) {
// 			todo.complete = true;
// 		}
// 	}
// 	return todo;
// }
const deleteAll = () => {
	DB = [];
}

const completeAll = () => {
	for(var todo in DB) {
		if(todo.complete !== true) {
			todo.complete = true;
		}
	}
}
module.exports = {
	make,
	// toggleItem,
	remove,
	toggle,
	deleteAll,
	completeAll

}
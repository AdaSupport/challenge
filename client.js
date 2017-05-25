const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input

class Todo {
    constructor(title='', complete=false, cid=+new Date()){
        this.title = title;
        this.complete = complete;
        this.cid = cid; // temp id before we get real id from the server
        this.id = null;
    }
}

class TodosList {
    constructor() {
        const todos = localStorage.getItem('todos');
        this.todos = todos ? JSON.parse(todos) : [];
    }

    set todos(newTodos) {
        localStorage.setItem('todos', JSON.stringify(newTodos));
        this._todos = newTodos;
        this.render();
    }

    get todos() {
        return this._todos;
    }

    add(todo) {
        this.todos = [...this.todos, todo];
    }

    remove(id){
        this.todos = this.todos.filter((item) => item.id != id);
    }

    toggle(id) {
        this.todos = this.todos.map((item) => {
            if (item.id == id) {
                return Object.assign({}, item, {complete: !item.complete});
            } else {
                return item;
            }
        });
    }

    completeAll() {
        this.todos = this.todos.map(
            (item) => Object.assign({}, item, {complete: true})
        )
    }

    deleteAll() {
        this.todos = [];
    }

    sync(data) {
        // when we receive data from the server,
        // sync our data
        this.todos = this.todos.map((item) => {
            if (item.cid == data.cid) {
                return Object.assign({}, item, data.todo);
            } else {
                return item;
            }
        });
    }

    render() {
        // We're re-rendering the whole list every time
        // It's inefficient; this is where a virtual dom would come in handy
        list.innerHTML = '';
        for(const todo of this.todos) {
            const listItem = document.createElement('li');
            const listItemText = document.createTextNode(todo.title);
            const deleteButton = document.createElement('span');

            listItem.setAttribute('data-id', todo.id);
            listItem.setAttribute('data-complete', todo.complete);

            deleteButton.classList.add('delete-button');

            listItem.appendChild(listItemText);
            listItem.appendChild(deleteButton);

            list.append(listItem);
        }
    }
}

const todosList = new TodosList();

function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    const newTodo = new Todo(title=input.value);

    todosList.add(newTodo);
    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value,
        cid   : newTodo.cid
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function toggle(todo) {
    const todoId = todo.getAttribute('data-id');
    todosList.toggle(todoId);
    server.emit('toggle', {
        id: todoId
    });
}

function deleteTodo(todo) {
    const todoId = todo.getAttribute('data-id');
    todosList.remove(todoId);
    server.emit('delete', todoId);
}

list.addEventListener('click', (e) => {
    const target = e.target;
    if(target.tagName == 'LI') {
        toggle(target);
    } else if (target.classList.contains('delete-button')) {
        deleteTodo(target.parentNode);
    }
});

document.getElementById('delete-all').addEventListener('click', (e) => {
    todosList.deleteAll();
    server.emit('delete_all');
});

document.getElementById('complete-all').addEventListener('click', (e) => {
    todosList.completeAll();
    server.emit('complete_all');
});

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todosList.todos = todos;
});

server.on('add', (todo) => {
    todosList.add(todo);
});

server.on('toggle', (todo) => {
    todosList.toggle(todo.id);
});

server.on('delete', (todoId) => {
    todosList.remove(todoId);
});

server.on('delete_all', () => {
    todosList.deleteAll();
});

server.on('complete_all', () => {
    todosList.completeAll();
});

server.on('sync', (data) => {
    todosList.sync(data);
});

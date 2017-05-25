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

function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function toggle(todo) {
    const todoId = todo.getAttribute('data-id');
    server.emit('toggle', {
        id: todoId
    });
}

function deleteTodo(todo) {
    const todoId = todo.getAttribute('data-id');
    server.emit('delete', todoId);
}

function findTodoById(todoId){
    const todos = Array.from(list.childNodes);
    return todos.find((todo) => todo.getAttribute('data-id') == todoId);
}

function render(todo) {
    console.log(todo);
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

list.addEventListener('click', (e) => {
    const target = e.target;
    if(target.tagName == 'LI') {
        toggle(target);
    } else if (target.classList.contains('delete-button')) {
        deleteTodo(target.parentNode);
    }
});

document.getElementById('delete-all').addEventListener('click', (e) => {
    server.emit('delete_all');
});

document.getElementById('complete-all').addEventListener('click', (e) => {
    server.emit('complete_all');
});

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

server.on('add', (todo) => {
    render(todo);
});

server.on('toggle', (todo) => {
    const todoNode = findTodoById(todo.id);
    todoNode.setAttribute('data-complete', todo.complete);
});

server.on('delete', (todoId) => {
    const todoNode = findTodoById(todoId);
    todoNode.remove();
});

server.on('delete_all', () => {
    list.innerHTML = '';
});

server.on('complete_all', () => {
    const todos = list.childNodes;
    Array.from(todos).forEach((todo) => {
        todo.setAttribute('data-complete', 'true');
    });
});

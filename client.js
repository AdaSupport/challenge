const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
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
    const isComplete = todo.getAttribute('data-complete') == 'true';

    server.emit('toggle', {
        id: todoId
    });
}

function findTodoById(todoId){
    const todos = Array.from(list.childNodes);
    return todos.find((todo) => todo.getAttribute('data-id') == todoId);
}

function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.setAttribute('data-id', todo.id);
    listItem.setAttribute('data-complete', todo.complete);
    listItem.appendChild(listItemText);
    list.append(listItem);
}

list.addEventListener('click', (e) => {
    const target = e.target;
    if(target.tagName == 'LI') {
        toggle(target);
    }
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

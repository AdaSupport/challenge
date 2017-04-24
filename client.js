const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

var AdditionOrder = Object.freeze({ APPEND: 0, PREPEND: 1});

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
    // TODO: refocus the element
}

// This function removes selected todo item
function remove() {
    var listItem = this.parentElement;
    var id = listItem.id;

    // Emit todo id to server
    server.emit('remove', id);
}

// This function removes all items from the list
function removeAll() {
    server.emit('removeAll');
}

// This function checks selected todo item
function check() {
    server.emit('check', this.id);
}

// This function checks all elements in the list
function checkAll() {
    server.emit('checkAll');
}

// This function adds new element(li) to the list depending of the order(AdditionOrder)
function render(todo, ao = AdditionOrder.APPEND) {
    const listItem = document.createElement('li');
    listItem.id = todo._id;
    listItem.className = (todo.isChecked) ? 'todo-checked' : 'todo-unchecked';
    listItem.addEventListener('click', check);

    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

    var removeSpan = document.createElement('span');
    removeSpan.className = 'todo-remove';
    removeSpan.appendChild( document.createTextNode("\u00D7") );
    removeSpan.addEventListener('click', remove);
    listItem.append(removeSpan);

    if (ao == AdditionOrder.APPEND) list.append(listItem);
    else if (ao == AdditionOrder.PREPEND) list.prepend(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
});

// This event is for the addition of new Todo item to the list
server.on('prepend', (todo) => {
    render(todo, AdditionOrder.PREPEND);
});

// This event removes todo by id
server.on('remove', (id) => {
    listItem = document.getElementById(id);
    list.removeChild(listItem);
});

// This event removes all todo items
server.on('removeAll', () => {
    list.innerHTML = '';
});

// This event checks todo by id
server.on('check', (id) => {
    listItem = document.getElementById(id);
    listItem.className = (listItem.className == 'todo-checked') ? 'todo-unchecked' : 'todo-checked';
});

// This event checks all todo items
server.on('checkAll', () => {
    items = Array.from( document.getElementsByClassName('todo-unchecked') );
    items.forEach((item) => item.className = 'todo-checked');
});

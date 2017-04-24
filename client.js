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

// This function adds new element(li) to the list depending of the order(AdditionOrder)
function render(todo, ao = AdditionOrder.APPEND) {
    const listItem = document.createElement('li');
    listItem.id = todo._id;

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    listItem.appendChild(checkbox);

    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

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

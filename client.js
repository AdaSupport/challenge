// missing express connect
const server = io.connect('http://localhost:3003/');
const list = document.getElementById('todo-list');

// Hacky
var val = null;

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    val = input.value;

    // Emit the new todo as some data to the server
    // ERR: Fixed title typo, doesn't send in ideal form
    // server.emit('make', {
    //     title : input.value
    // });

    server.emit('make', val);

    // Clear the input
    input.value = '';
    // TODO: refocus the element, Done
    input.focus();
}

function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);
    list.append(listItem);
}

// Send server connect log
server.on('connect', () => {
    console.log('client is working');
    server.emit('join', 'client is connected');
});

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    console.log(todos);

    // todos.forEach((todo) => render(todo));
    // Render with for loop
    for (todo in todos) {
        render(todos[todo]);
    }
});

const socket = io.connect('http://localhost:3003/'); //
const list = document.getElementById('todo-list');   //


socket.on('connect', function(data) {
            socket.emit('join', 'Hello World from client');
});
// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    socket.emit('make', {
        titlé : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);
    list.append(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
socket.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

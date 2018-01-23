const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
// const currentDate = document.getElementById('section--current-date');


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
    input.focus();
}

function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`
    const listItemText = document.createTextNode(todo.title);
    const completeCheck = document.createElement('input');
    completeCheck.type = "checkbox";
    completeCheck.name = "todo";
    completeCheck.value = "value";

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';

    listItem.appendChild(listItemText);
    listItem.prepend(completeCheck);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

server.on('addNew', todo => {
    render(todo);
});

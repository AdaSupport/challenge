const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function render(todo) {
    const listItem = document.createElement('li');
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.isChecked;
    checkBox.addEventListener('change', () => server.emit('check', [todo.id]));

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => server.emit('delete', [todo.id]));

    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(checkBox);
    listItem.appendChild(listItemText);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}



// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
});

const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

let todoIds = [];

function add() {
    const input = document.getElementById('todo-input');

    // Emit the new todo to server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function deleteAll() {
    server.emit('delete', todoIds)
}

function completeAll() {
    server.emit('check', todoIds)
}

function render(todo) {

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.isChecked;
    checkBox.addEventListener('change', () => server.emit('check', [todo.id]));

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => server.emit('delete', [todo.id]));

    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);

    listItem.appendChild(checkBox);
    listItem.appendChild(listItemText);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}



//listeners for events from the server
server.on('load', (todos) => {
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
    todoIds = todos.map(todo => todo.id);
    console.log(todoIds);
});

const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

let allTodos = [];

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
    server.emit('delete', allTodos.map(todo => todo.id))
}

function completeAll() {
    server.emit('check', allTodos.map(todo => ({id: todo.id, isChecked: true})));
}

function render(todo) {
    const listItem = document.createElement('tr');
    const listItemText = document.createTextNode(todo.title);

    let titleTd = document.createElement('td');
    titleTd.addEventListener('click', () => server.emit('check', [{id: todo.id, isChecked: !todo.isChecked}]));
    titleTd.appendChild(listItemText);
    titleTd.classList.add('mdl-data-table__cell--non-numeric');
    titleTd.classList.add(todo.isChecked ? 'checked' : 'unchecked');

    const deleteButton = document.createElement('td');
    deleteButton.classList.add('mdl-data-table__cell--non-numeric');
    deleteButton.classList.add('delete');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => server.emit('delete', [todo.id]));


    listItem.appendChild(titleTd);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}

//listeners for events from the server
server.on('load', (todos) => {
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
    allTodos = todos;
});

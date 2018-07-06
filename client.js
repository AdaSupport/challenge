const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

//Gets todos from local storage on page load, if undefined (eg. initial start up of app) set to empty array
let allTodos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
//Handles rendering for offline cases
allTodos.forEach((todo) => render(todo));

//Called when add task button is clicked, or on enter keydown
function addTodo() {
    const input = document.getElementById('todo-input');

    // Emit the new todo to server
    server.emit('make', {
        title : input.value
    });
    // Clears and refocuses the input
    input.value = '';
    input.focus();
}

function deleteAll() {
    server.emit('delete', allTodos.map(todo => todo.id))
}

function completeAll() {
    server.emit('check', allTodos.map(todo => ({id: todo.id, isChecked: true})));
}

//Called each time load event from server occurs
function render(todo) {
    const listItem = document.createElement('tr');
    const listItemText = document.createTextNode(todo.title);

    let titleTd = document.createElement('td');
    //Emits to server when
    titleTd.addEventListener('click', () => server.emit('check', [{id: todo.id, isChecked: !todo.isChecked}]));
    titleTd.appendChild(listItemText);
    titleTd.classList.add('mdl-data-table__cell--non-numeric');

    //Conditionally adds class for checked todo for styling
    titleTd.classList.add(todo.isChecked ? 'checked' : 'unchecked');


    const deleteButton = document.createElement('td');
    deleteButton.classList.add('mdl-data-table__cell--non-numeric');
    deleteButton.classList.add('delete');
    deleteButton.innerText = 'Delete';

    //Emits to server when a todo is deleted
    deleteButton.addEventListener('click', () => server.emit('delete', [todo.id]));

    //Adds title and delete button to to listItem, adds list items to the table
    listItem.appendChild(titleTd);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}

//Listens for load event from the server
server.on('load', (todos) => {
    //Clears out table list items to ensure no duplication
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
    allTodos = todos;
    //Sets local storage value to latest todos from server
    localStorage.setItem('todos', JSON.stringify(todos));
});

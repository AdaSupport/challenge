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

    // Refocus the element
    input.focus();
}

// TODO use React for rendering
function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.dataset.id = todo.id;

    const listItemText = document.createTextNode(todo.title);

    const listItemCheckbox = document.createElement('input');
    listItemCheckbox.type = 'checkbox';
    listItemCheckbox.onclick = (event) => {
      todo.completed = event.target.checked;
      server.emit('update', todo);
    };

    const listItemDelete = document.createElement('input');
    listItemDelete.type = 'button';
    listItemDelete.value = 'x';
    listItemDelete.onclick = () => {
      server.emit('delete', todo);
    }

    listItem.appendChild(listItemCheckbox);
    listItem.appendChild(listItemText);
    listItem.appendChild(listItemDelete);
    list.append(listItem);
}

function find(todo) {
    return list.querySelector('[data-id="' + todo.id + '"]');
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    [...list.children].forEach((el) => list.removeChild(el));
    todos.forEach((todo) => render(todo));
});

server.on('new', (todo) => {
    render(todo);
});

server.on('updated-todo', (todo) => {
    const todoEl = find(todo);
    todoEl.querySelector('input').checked = todo.completed;

    if (todo.completed) todoEl.style.textDecoration = 'line-through';
    else todoEl.style.textDecoration = 'none';
});

server.on('deleted-todo', (todo) => {
    list.removeChild(find(todo));
});

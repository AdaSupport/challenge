const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// Startup
const TodoCache = loadCache();
TodoCache.forEach((todo) => render(todo));
disableInput();

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
    if (todo.completed) listItem.style.textDecoration = 'line-through';
    else listItem.style.textDecoration = 'none';

    const listItemText = document.createTextNode(todo.title);

    const listItemCheckbox = document.createElement('input');
    listItemCheckbox.type = 'checkbox';
    listItemCheckbox.checked = todo.completed;
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

function completeAll() {
    server.emit('complete-all');
}

function deleteAll() {
    server.emit('delete-all');
}

// Helper Methods

function saveCache() {
    window.localStorage.todos = JSON.stringify(Array.from(TodoCache.entries()));
}

function loadCache() {
    if (!window.localStorage.todos) return new Map();
    return new Map(JSON.parse(window.localStorage.todos));
}

function disableInput() {
  [...document.querySelectorAll('input')].forEach((el) => {
    el.disabled = true;
  });
}

function find(todo) {
    return list.querySelector('[data-id="' + todo.id + '"]');
}

// Prevent users from interacting when connection is disabled
server.on('disconnect', () => {
  disableInput();
});

// Allow users to interact when connected to server
server.on('connect', () => {
  [...document.querySelectorAll('input')].forEach((el) => {
    el.disabled = false;
  });
});

// Reload the entire list of todos from the server
server.on('load', (todos) => {
    [...list.children].forEach((el) => list.removeChild(el));
    todos.forEach((todo) => render(todo));
    
    // Update cache
    TodoCache.clear();
    todos.map((todo) => TodoCache.set(todo.id, todo));
    saveCache();
});

// Receive new todo from server
server.on('new', (todo) => {
    render(todo);

    // Update cache
    TodoCache.set(todo.id, todo);
    saveCache();
});

// Receive updated todo from server
server.on('updated-todo', (todo) => {
    const todoEl = find(todo);
    todoEl.querySelector('input').checked = todo.completed;

    if (todo.completed) todoEl.style.textDecoration = 'line-through';
    else todoEl.style.textDecoration = 'none';

    // Update cache
    TodoCache.set(todo.id, todo);
    saveCache();
});

// Receive deleted todo from server
server.on('deleted-todo', (todo) => {
    list.removeChild(find(todo));

    // Update cache
    TodoCache.delete(todo.id);
    saveCache();
});

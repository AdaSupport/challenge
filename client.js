const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

var AdditionOrder = Object.freeze({ APPEND: 0, PREPEND: 1});
var isFirstConnection = true;

document.body.onload = function() {
   var input = document.getElementById('todo-input');
   input.onkeyup = function(e) {
    if(e.keyCode == 13) // Enter key
      add();
   };
};

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    const input = document.getElementById('todo-input');

    if (input.value == "") return;

    // Emit the new todo as some data to the server
    server.emit('createTodo', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

// This function removes selected todo item
function remove() {
    var listItem = this.parentElement;
    var id = listItem.id;

    // Emit todo id to server
    server.emit('removeTodo', id);
}

// This function removes all items from the list
function removeAll() {
    server.emit('removeAll');
}

// This function checks selected todo item
function check() {
    server.emit('checkTodo', this.id);
}

// This function checks all elements in the list
function checkAll() {
    server.emit('checkAll');
}

// This function adds new element(li) to the list depending of the order(AdditionOrder)
function render(todo, ao = AdditionOrder.APPEND) {
    const listItem = document.createElement('li');
    listItem.id = todo._id;
    listItem.className = (todo.isChecked) ? 'todo-checked' : 'todo-unchecked';
    listItem.addEventListener('click', check);

    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

    var removeSpan = document.createElement('span');
    removeSpan.className = 'todo-remove';
    removeSpan.appendChild( document.createTextNode("\u00D7") );
    removeSpan.addEventListener('click', remove);
    listItem.append(removeSpan);

    if (ao == AdditionOrder.APPEND) list.append(listItem);
    else if (ao == AdditionOrder.PREPEND) list.prepend(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    list.innerHTML = '';
    cachClear();
    todos.forEach((todo) => {
        render(todo);
        cachAddItem(todo);
    });
});

// This event is to report that connection was lost
server.on('connect_error', () => {
    if (isFirstConnection)
        cachGet().forEach((todo) => render(todo));
    isFirstConnection = false;
})

// This event is for the addition of new Todo item to the list
server.on('prepend', (todo) => {
    render(todo, AdditionOrder.PREPEND);
    cachAddItem(todo);
});

// This event removes todo by id
server.on('remove', (id) => {
    listItem = document.getElementById(id);
    list.removeChild(listItem);
    cachRemoveItem(id);
});

// This event removes all todo items
server.on('removeAll', () => {
    list.innerHTML = '';
    cachClear();
});

// This event checks todo by id
server.on('check', (id) => {
    listItem = document.getElementById(id);
    listItem.className = (listItem.className == 'todo-checked') ? 'todo-unchecked' : 'todo-checked';
    cachCheckItem(id);
});

// This event checks all todo items
server.on('checkAll', () => {
    items = Array.from( document.getElementsByClassName('todo-unchecked') );
    items.forEach((item) => item.className = 'todo-checked');
    cachCheckAll();
});

// NOTE: These are functions responsible for caching

// Add todo to existing cach
var cachAddItem = (todo) => {
    var todosSaved = cachGet();
    localStorage.setItem(todo._id, JSON.stringify(todo));
};

// Chek item by key
var cachCheckItem = (key) => {
    var item = JSON.parse(localStorage[key]);
    item['isChecked'] = !item['isChecked'];
    localStorage.setItem(key, JSON.stringify(item));
};

// Check all items
var cachCheckAll = () => {
    var cachedItems = cachGet().forEach((todo) => { cachCheckItem(todo._id) } );
};

//Get cached data
var cachGet = () => {
    var values = [], data = [];
    var keys = Object.keys(localStorage).map((key) => parseInt(key));
    keys.sort(function(a,b){return b - a}); // to enshure that the orer of items is kept
    keys.map((key) => data.push(JSON.parse(localStorage.getItem(key))));
    return data;
};

// Remove item by id
var cachRemoveItem = (id) => {
    localStorage.removeItem(id);
};

// Clear cach
var cachClear = () => {
    localStorage.clear();
};
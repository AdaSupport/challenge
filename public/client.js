const socket = io();
const list = document.getElementById('todo-list');
const inputField = document.getElementById('todo-input');



// making use of the enter key to add a new item
inputField.addEventListener('keydown', function(e) {
    if(e.keyCode === 13) {
        add()
    }
});

// NOTE: These are all our globally scoped functions for interacting with the server
function removeItem(todo) {
    socket.emit('delete', todo);
}

// This function adds a new todo from the input
function add() {
    socket.emit('make', {
        title : inputField.value
    });

    inputField.value = '';
    inputField.focus();
}

// mark item complete
function markComplete(todo) {
    socket.emit('markComplete', todo);
}

// mark item incomplete
function markIncomplete(todo) {
    socket.emit('markIncomplete', todo);
}

// function for adding and getting the array to and from localStorage
function addToStorage(item) {
    localStorage.setItem('todos', JSON.stringify(item));
}


function getFromStorage() {
    return JSON.parse(localStorage.getItem('todos'));
}

// create a new checkbox element
function createCheckBox(todo) {
    const checkLabel = document.createElement('label');
    checkLabel.classList.add('container');
    checkLabel.textContent = `${todo.title}`;
    checkLabel.setAttribute("id", `label-${todo.id}`);

    const checkBox = document.createElement('input');
    checkBox.setAttribute("class", "complete--checkBox");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", `check-${todo.id}`);

    const checkMark = document.createElement('span');
    checkMark.classList.add('checkmark');


    checkBox.addEventListener('change', function(event) {
        event.preventDefault();
        if(checkBox.checked === true) {
            markComplete(todo);
        } else if(checkBox.checked === false){
            markIncomplete(todo);
        }
    });

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete');
    deleteButton.classList.add('rounded');
    deleteButton.classList.add('thick');
    deleteButton.id = `${todo.id}`;
    deleteButton.addEventListener('click', function() {
        removeItem(todo);
    });

    checkLabel.appendChild(checkBox);
    checkLabel.appendChild(checkMark);
    checkLabel.appendChild(deleteButton);
    return checkLabel;
}

// delete all items from the list
function deleteAll() {
    socket.emit('deleteAll');
}

// complete all items on the list
function completeAll(e) {
    e.preventDefault();
    socket.emit('completeAll');

}


// render the to-do list item to the page
function render(todo) {
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`;
    listItem.classList.add('single--item');

    listItem.appendChild(createCheckBox(todo));
    list.append(listItem);
}



// NOTE: These are listeners for events from the server
socket.on('load', (todos) => {
    if(todos.length === 0) {
        list.innerHTML = '';
        addToStorage(todos);
    } else {
        list.innerHTML = '';
        addToStorage(todos);
        todos.forEach((todo) => {
            render(todo);
            if(todo.complete === true) {
                document.getElementById(`check-${todo.id}`).checked = true;
            } else if(todo.complete === false) {
                document.getElementById(`check-${todo.id}`).checked = false;
            }
        });
    }

});

// if there is a loading error, load from localStorage
socket.on('connect_error', () => {
    list.innerHTML = '';
    let todos = getFromStorage();
    todos.forEach((todo) => render(todo));
});

// add a new todo to the bottom of the list adn to localStorage
socket.on('addNew', todo => {
    render(todo);
    let DB = getFromStorage();
    DB.push(todo);
    addToStorage(DB);
});

// delete a todo item from the list
socket.on('delete', todo => {
    let deleteItem = document.getElementById(`${todo.id}`);
    deleteItem.parentNode.removeChild(deleteItem);
});

// listen for when an item gets marked complete
socket.on('complete', todo => {
    document.getElementById(`check-${todo.id}`).checked = true;
});

// listen for when an item gets marked incomplete
socket.on('incomplete', todo => {
    document.getElementById(`check-${todo.id}`).checked = false;
});


const socket = io();
const list = document.getElementById('todo-list');
const date = document.getElementById('current--date');
const inputField = document.getElementById('todo-input');



// making use of the enter key to add a new item
inputField.addEventListener('keydown', function(e) {
    if(e.keyCode === 13) {
        add()
    }
});

// NOTE: These are all our globally scoped functions for interacting with the server
function removeItem(todo) {
    console.log(`removing item with ${todo.id}`);
    // let deleteItem = document.getElementById(`${todo.id}`);
    // deleteItem.parentNode.removeChild(deleteItem);
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


function markComplete(todo) {
    console.log('Marking complete');
    socket.emit('markComplete', todo);
}

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

function markIncomplete(todo) {
    console.log('Marking Incomplete');
    socket.emit('markIncomplete', todo);
}

function deleteAll() {
    // console.log('clicking delete');
    socket.emit('deleteAll');
}

function completeAll(e) {
    e.preventDefault();
    socket.emit('completeAll');

}

function toggle(todo) {
    socket.emit('toggle', todo);
}

// function adds mamkes a new li node and adds the new todo to that node.
function render(todo) {
    // console.log(todo);
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`;
    listItem.classList.add('single--item');

    listItem.appendChild(createCheckBox(todo));
    list.append(listItem);
}



// function for adding and getting the array to and from localStorage
function addToStorage(item) {
    localStorage.setItem('todos', JSON.stringify(item));
}

function getFromStorage() {
    return JSON.parse(localStorage.getItem('todos'));
}
// NOTE: These are listeners for events from the server
socket.on('load', (todos) => {
    if(todos.length === 0) {
        list.innerHTML = '';
        addToStorage(todos);
        console.log(localStorage['todos']);
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

// add a new todo to the bottom of the list
socket.on('addNew', todo => {
    render(todo);
    let DB = getFromStorage();
    DB.push(todo);
    addToStorage(DB);
    console.log(localStorage['todos']);
});

// delete a todo item from the list
socket.on('delete', todo => {
    // console.log(todo.id)
    let deleteItem = document.getElementById(`${todo.id}`);
    deleteItem.parentNode.removeChild(deleteItem);
});

socket.on('complete', todo => {
    document.getElementById(`check-${todo.id}`).checked = true;
    console.log(`${todo.id} ${todo.complete} ${todo.title}`);
});

socket.on('incomplete', todo => {
    document.getElementById(`check-${todo.id}`).checked = false;
    console.log(`${todo.id} ${todo.complete} ${todo.title}`);
});

socket.on('deleteAll', () => {
    list.innerHTML = '';
});


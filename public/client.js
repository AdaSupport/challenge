const socket = io('http://localhost:3003');
const list = document.getElementById('todo-list');
const date = document.getElementById('current--date');

// const currentDate = document.getElementById('section--current-date');

function getCurrentDate() {
    var options = { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' };
    var today = new Date();
    date.textContent = today.toLocaleDateString("en-US", options);
}
getCurrentDate();
// NOTE: These are all our globally scoped functions for interacting with the server
function removeItem(todo) {
    console.log(`removing item with ${todo.id}`);
    let deleteItem = document.getElementById(`${todo.id}`);
    deleteItem.parentNode.removeChild(deleteItem);
    socket.emit('delete', todo);
}


// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    socket.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
    input.focus();
}

// create the complete button
function createButton(todo) {
    const completeCheck = document.createElement('button');
    completeCheck.name = "todo";
    completeCheck.textContent = "Complete";
    completeCheck.classList.add('complete--button');
    completeCheck.id = `buttonId-${todo.id}`;
    completeCheck.addEventListener('click', function() {
        // toggle(todo);
        if(todo.complete === false) {
            completeCheck.textContent = 'Mark Incomplete';
            markComplete(todo);
        } else if(todo.complete === true) {
            completeCheck.textContent = 'Complete';
            markIncomplete(todo);
        }
    });

    return completeCheck;
}

function markComplete(todo) {
    console.log('Markind complete');
    socket.emit('markComplete', todo);
}

function markIncomplete(todo) {
    console.log('Marking Incomplete');
    socket.emit('markIncomplete', todo);
}

function deleteAll() {
    console.log('clicking delete');
    socket.emit('deleteAll');
}

function completeAll() {
    socket.emit('completeAll');
}
// function adds mamkes a new li node and adds the new todo to that node.
function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`
    const listItemText = document.createTextNode(todo.title);

    // create the delete button
    const deleteButton = document.createElement('button');
    const text = document.createTextNode('delete');
    deleteButton.append(text);
    deleteButton.id = `${todo.id}`;
    deleteButton.addEventListener('click', function() {
        removeItem(todo);
    });


    listItem.appendChild(listItemText);
    listItem.prepend(createButton(todo));
    listItem.appendChild(deleteButton);
    list.append(listItem);
}


// NOTE: These are listeners for events from the server
socket.on('load', (todos) => {
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
});

socket.on('addNew', todo => {
    render(todo);
});

socket.on('delete', todo => {
    let deleteItem = document.getElementById(`${todo.id}`);
    deleteItem.parentNode.removeChild(deleteItem);
});

socket.on('complete', todo => {
    let completeButton = document.getElementById(`buttonId-${todo.id}`);
    completeButton.textContent = 'Mark Incomplete';
    // completeButton.parentNode.removeChild(completeButton);
});

socket.on('markIncomplete', todo => {
    let incompleteButton = document.getElementById(`buttonId-${todo.id}`);

    incompleteButton.textContent = 'Complete';
    // completeButton.parentNode.removeChild(completeButton);
});
// socket.on('toggledItem', todo => {
//     let completeCheck  = document.getElementById(`buttonId-${todo.id}`);
//     completeCheck.textContent = `${todo.complete ? "Mark Incomplete" : "complete"}`;
//     // completeButton.parentNode.removeChild(completeButton);
// });
socket.on('deleteAll', () => {
    list.innerHTML = '';
});

socket.on('completeAll', () => {
     console.log('completing tasks');
});



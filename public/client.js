const socket = io('http://localhost:3003');
const list = document.getElementById('todo-list');

// const currentDate = document.getElementById('section--current-date');


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

function markComplete(todo) {
    console.log('Clicking the button');
    socket.emit('markComplete', todo);
}

// function markIncomplete(todo) {
//     socket.emit('markIncomplete', todo);
// }

// function adds mamkes a new li node and adds the new todo to that node.
function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`
    const listItemText = document.createTextNode(todo.title);

    // create the checkbox to mark an item complete
    const completeCheck = document.createElement('button');
    // completeCheck.type = "checkbox";
    completeCheck.name = "todo";
    completeCheck.innerHTML = "mark complete";
    completeCheck.classList.add('complete--button');
    completeCheck.id = `buttonId-${todo.id}`;
    completeCheck.addEventListener('click', function() {
        markComplete(todo);
    });
    // completeCheck.onclick = markComplete(todo);

    // create the delete button
    const deleteButton = document.createElement('button');
    const text = document.createTextNode('delete');
    deleteButton.append(text);
    deleteButton.id = `${todo.id}`;
    deleteButton.addEventListener('click', function() {
        removeItem(todo);
    });


    listItem.appendChild(listItemText);
    listItem.prepend(completeCheck);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}


// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
socket.on('load', (todos) => {
    // because the list keeps multiplying, clear the todo list element once a connection is made
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
});

// // this event is for rendering the newly added to-do item under the current list
socket.on('addNew', todo => {
    // console.log(localStorage);
    render(todo);
});

socket.on('news', (data) => {
    console.log(data);
    // socket.emit('more news', {my: 'data'});
});

socket.on('delete', todo => {
    let deleteItem = document.getElementById(`${todo.id}`);
    deleteItem.parentNode.removeChild(deleteItem);
});

socket.on('complete', todo => {
    let completeButton = document.getElementById(`buttonId-${todo.id}`);
    completeButton.parentNode.removeChild(completeButton);
});



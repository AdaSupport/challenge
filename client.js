const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// const currentDate = document.getElementById('section--current-date');


// NOTE: These are all our globally scoped functions for interacting with the server
remove = (todo) => {
    server.emit('delete', todo)
}




// This function adds a new todo from the input
add = () => {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
    input.focus();
}

// function adds mamkes a new li node and adds the new todo to that node.
render = (todo) => {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.id = `${todo.id}`
    const listItemText = document.createTextNode(todo.title);
    const completeCheck = document.createElement('input');
    completeCheck.type = "checkbox";
    completeCheck.name = "todo";
    completeCheck.value = "value";

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.id = `${todo.id}`;
    deleteButton.onClick = remove(todo)


    listItem.appendChild(listItemText);
    listItem.prepend(completeCheck);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}

remove = (todo) => {
    console.log(`removing item with id: ${todo.id}`);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    // because the list keeps multiplying, clear the todo list element once a connection is made
    list.innerHTML = '';
    todos.forEach((todo) => render(todo));
});

// this event is for rendering the newly added to-do item under the current list
server.on('addNew', todo => {
    render(todo);
});



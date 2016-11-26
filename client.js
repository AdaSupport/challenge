const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function addTask() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('addTask', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function completeTask()
{
    server.emit('completeTask', {
        label : this.parentNode.childNodes[1].innerHTML,
        isComplete : this.checked
    });
}

function completeAllTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        if (!list.childNodes[i].childNodes[0].checked) list.childNodes[i].childNodes[0].click();
    }
}


function render(todo) {
    console.log(todo);

    const listItem = document.createElement('li');
    const listItemText = createLabel(todo.title);
    const listItemCheckbox = createCheckbox(todo.isComplete);

    listItem.appendChild(listItemCheckbox);
    listItem.appendChild(listItemText);

    list.append(listItem);
}


// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }

    todos.forEach((todo) => render(todo));
});

server.on('refresh', (todos) => {
    todos.forEach((todo) => render(todo));
});


// NOTE: these are utility functions
function createLabel(labelText)
{
    var label = document.createElement('label');
    label.innerHTML = labelText;

    return label;
}

function createCheckbox(isComplete)
{
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.onclick = completeTask;
    checkbox.checked = isComplete;

    return checkbox;
}
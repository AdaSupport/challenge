const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const xBtnLoc = 0;
const checkboxLoc = 1;
const labelLoc = 2;


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
        label : this.parentNode.childNodes[labelLoc].innerHTML,
        isComplete : this.checked
    });
}

function completeAllTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        if (!list.childNodes[i].childNodes[checkboxLoc].checked) list.childNodes[i].childNodes[checkboxLoc].click();
    }
}

function deleteTask()
{
    server.emit('deleteTask', {
        label : this.parentNode.childNodes[labelLoc].innerHTML,
    });
}

function deleteAllTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        list.childNodes[i].childNodes[xBtnLoc].click();
    }
}

function render(todo) {
    console.log(todo);

    const listItem = document.createElement('li');
    const listItemText = createLabel(todo.title);
    const listItemCheckbox = createCheckbox(todo.isComplete);
    const listItemButton = createButton();

    listItem.appendChild(listItemButton);
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
function createButton()
{
    var button = document.createElement("BUTTON");
    var t = document.createTextNode("X");

    button.appendChild(t);
    button.onclick = deleteTask;

    return button;
}

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
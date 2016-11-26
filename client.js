const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

const BUTTON = "BUTTON";
const CHECKBOX = "INPUT";
const TITLE = "LABEL";

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new task from the input
function addTask() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    if (input.value == "") alert("There is no description for this task!")
    else 
        {
            server.emit('addTask', {
                title : input.value
            });
        }

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function completeTask()
{
    server.emit('completeTask', {
        title : this.parentNode.getElementsByTagName(TITLE)[0].innerHTML,
        uuid : this.parentNode.id,
        isComplete : this.checked
    });
}

function completeAllTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        if (!list.childNodes[i].getElementsByTagName(CHECKBOX)[0].checked) list.childNodes[i].getElementsByTagName(CHECKBOX)[0].click();
    }
}

function deleteTask()
{
    server.emit('deleteTask', {
        title : this.parentNode.getElementsByTagName(TITLE)[0].innerHTML,
        uuid : this.parentNode.id
    });
}

function deleteAllTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        list.childNodes[i].getElementsByTagName(BUTTON)[0].click();
    }
}

function deleteAllCompletedTasks()
{
    for (var i = 0; i < list.children.length; i++) {
        if (list.childNodes[i].getElementsByTagName(CHECKBOX)[0].checked) list.childNodes[i].getElementsByTagName(BUTTON)[0].click();
    }
}

function render(task) {
    // cache, must delete too
    //sessionStorage.setItem(todo.uuid, todo)
    console.log(task);

    // if the element already exists, just update rather than recreate
    var element = document.getElementById(task.uuid)
    if (element != null) element.getElementsByTagName(CHECKBOX)[0].checked = task.isComplete;
        //element.childNodes[checkboxLoc].checked = task.isComplete;
    else
    {
        const listItem = document.createElement('LI');
        const listItemText = createLabel(task.title);
        const listItemCheckbox = createCheckbox(task.isComplete);
        const listItemButton = createButton();

        //listItem.className = "mdl-card mdl-shadow--2dp";

        listItem.id = task.uuid;
        listItem.appendChild(listItemText);
        listItem.appendChild(listItemButton);
        listItem.appendChild(listItemCheckbox);

        list.append(listItem);
    }
}


// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    //cache = todos;
    //window.sessionStorage.setItem('cache', cache)
    //var tmp = window.sessionStorage.getItem('cache')

    //alert('load ' + tmp)

    while(list.firstChild){
        list.removeChild(list.firstChild);
    }

    todos.forEach((todo) => render(todo));
});

server.on('refresh', (todos) => {
    todos.forEach((todo) => render(todo));

    //cache.concate(todos);
    //window.sessionStorage.setItem('cache', cache)
    //alert('refresh ' + cache[0].title)
});

server.on('connect_error', () => {
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }

    //var session = window.sessionStorage.getItem('cache')
    //alert('conner ' + session[0].title)
    //session.forEach((todo) => render(todo));
});

// NOTE: these are utility functions
function createButton()
{
    var button = document.createElement(BUTTON);
    var t = document.createTextNode("DELETE");

    button.appendChild(t);
    button.onclick = deleteTask;
    //button.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";

    return button;
}

function createLabel(labelText)
{
    var label = document.createElement(TITLE);

    label.innerHTML = labelText;

    return label;
}

function createCheckbox(isComplete)
{
    var checkbox = document.createElement(CHECKBOX);
    checkbox.type = "checkbox";
    checkbox.onclick = completeTask;
    checkbox.checked = isComplete;
    //checkbox.className = "mdl-radio__button";

    return checkbox;
}
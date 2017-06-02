const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

const BUTTON = "BUTTON";
const CHECKBOX = "INPUT";
const TITLE = "H5";

// Add enter key event listener to Make button. 
// When creating lots of task, I found that using the enter key instead of the button made a huge difference.
document.getElementById("todo-input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("make_btn").click();
    }
});

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
    input.focus();
}

function completeTask()
{
    var taskCardActionBox = this.parentNode;
    var taskCard = taskCardActionBox.parentNode;

    server.emit('completeTask', {
        title : taskCard.getElementsByTagName(TITLE)[0].innerHTML,
        uuid : taskCard.id,
        isComplete : this.checked
    });
}

function completeAllTasks()
{
    for (var i in sessionStorage) {
        var task = JSON.parse(sessionStorage.getItem(i));

        if (!task.isComplete)
        {
            server.emit('completeTask', {
                title : task.title,
                uuid : task.uuid,
                isComplete : true
            });
        }
    } 
}

function deleteTask()
{
    var taskCardActionBox = this.parentNode;
    var taskCard = taskCardActionBox.parentNode;

    server.emit('deleteTask', {
        title : taskCard.getElementsByTagName(TITLE)[0].innerHTML,
        uuid : taskCard.id
    });
}

function deleteAllTasks()
{
    for (var i in sessionStorage) {
        var task = JSON.parse(sessionStorage.getItem(i));

        server.emit('deleteTask', {
            title : task.title,
            uuid : task.uuid
        });
    } 
}

function deleteAllCompletedTasks()
{
    for (var i in sessionStorage) {
        var task = JSON.parse(sessionStorage.getItem(i));

        if (task.isComplete)
        {
            server.emit('deleteTask', {
                title : task.title,
                uuid : task.uuid
            });
        }
    } 
}

function render(task) {
    //console.log(task);
    cache(task)

    // update existing element or attach new one
    var element = document.getElementById(task.uuid)
    if (element != null) element.getElementsByTagName(CHECKBOX)[0].checked = task.isComplete;
    else list.append(createTaskCard(task));
}


// NOTE: These are listeners for events from the server
// load renders the entire DB
server.on('load', (todos) => {
    clearList();
    sessionStorage.clear();
    todos.forEach((todo) => render(todo));
});

// refresh renders only the tasks that needs to be updated or added rather than the whole DB
server.on('refresh', (todos) => {
    todos.forEach((todo) => render(todo));
});

// clear cache from previous connection if new connection is successfull
server.on('connect', (todos) => {
    sessionStorage.clear();
});

// render tasks from cache if client cannot connect to server
server.on('connect_error', () => {
    clearList();
    
    // when reloading from cache, we can't guarantee the order
    for (var i in sessionStorage){
       render(JSON.parse(sessionStorage.getItem(i)));
    } 
});

// NOTE: These are utility functions
function cache(task)
{
    sessionStorage.setItem(task.uuid, JSON.stringify(task));
}

// clears current task list to redraw new ones
function clearList()
{
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}

// create the card html element to display each task
function createTaskCard(task)
{
    // action box
    const listItemActionBox = document.createElement('DIV');
    listItemActionBox.className = "card-action";

    const listItemButton = createButton();
    listItemActionBox.append(listItemButton);

    var checkbox = document.createElement(CHECKBOX);
    checkbox.className = "filled-in";
    checkbox.type = "checkbox";
    checkbox.onclick = completeTask;
    checkbox.checked = task.isComplete;
    const cid = Math.random();
    checkbox.id = cid;

    var label = document.createElement("LABEL");
    label.innerHTML = "COMPLETED";
    label.htmlFor = cid;
    listItemActionBox.append(checkbox);
    listItemActionBox.append(label);
    
    // text box
    const listItemTextbox = document.createElement('DIV');
    listItemTextbox.className = "card-content grey-text";

    const listItemText = createLabel(task.title);
    listItemTextbox.append(listItemText);

    // card
    const listItem = document.createElement('DIV');
    listItem.id = task.uuid;
    listItem.className = "card white darken-1";
    listItem.appendChild(listItemTextbox);
    listItem.appendChild(listItemActionBox);

    return listItem;
}

function createButton()
{
    var button = document.createElement("BUTTON");
    var t = document.createTextNode("Delete");

    button.className = "btn delete";
    button.appendChild(t);
    button.onclick = deleteTask;

    return button;
}

function createLabel(labelText)
{
    var label = document.createElement(TITLE);

    label.class = "flow-text";
    label.innerHTML = labelText;

    return label;
}
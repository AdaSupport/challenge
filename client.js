// missing express connect
const server = io.connect('http://localhost:3003/');
const list = document.getElementById('todo-list');

// Send server connect log
server.on('connect', () => {
    console.log('client is working');
    server.emit('join', 'client is connected');
});

// Hacky
var val = null;

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    val = input.value;

    // Emit the new todo as some data to the server
    // ERR: Fixed title typo, doesn't send in ideal form
    // server.emit('make', {
    //     title : input.value
    // });

    server.emit('make', val);

    // Clear the input
    input.value = '';
    // TODO: refocus the element, Done
    input.focus();
}

function render(todo) {
    // console.log(todo);
    const listItem = document.createElement('li');
    const listItemBtn = document.createElement('a');
    listItemBtn.setAttribute('class', 'item');
    const deleteBtn = document.createElement('a');
    deleteBtn.setAttribute('class', 'btn-delete');
    const listItemText = document.createTextNode(todo.title);
    listItemBtn.append(listItemText);
    listItem.append(listItemBtn);
    listItem.append(deleteBtn);
    list.append(listItem);

    listItemBtn.onclick = complete;
    deleteBtn.onclick = remove;

    function checkStatus() {
        switch (todo.status) {
            case 'active':
                listItem.style.color = '#000';
            break;
            case 'done':
                listItem.style.color = '#2ecc71';
            break;
        }
    }

    checkStatus();

    

    function complete() {
        // console.log('click click boom');
        // const item = document.getElementById('item');
        // item.addEventListener('click', function(){
        //     console.log(this);
        // });
        // console.log(item.innerHTML);
        // listItem.style.color = '#2ECC71';
        
        // else if (listItem.style.color = ''){
        //     listItem.style.color = '#2ECC71';
        // }

        // Create as if, refactor as switch statement
        // if (todo.status == 'active') {
        //     listItem.style.color = '#000';
        // }

        // console.log(todo);
        // console.log(todo.status);

        switch (todo.status) {
            case "active":
            listItem.style.color = '#2ecc71';
            todo.status = "done";
            server.emit('status', todo);
            console.log(todo);
            break;
            case "done":
            listItem.style.color = "#000";
            todo.status = "active";
            server.emit('status', todo);
            console.log(todo)
            break;
        }
        

        // console.log(listItem);
    }
    function remove() {
        console.log(todo);
        server.emit('remove', todo);
    }
}

function completeAll() {
    const Items = document.querySelectorAll('.item');

    switch (todo.status) {
            case "active":
            Items.style.color = '#2ecc71';
            todo.status = "done";
            break;
            case "done":
            Items.style.color = "#000";
            todo.status = "active";
            break;
        }
        console.log(todo.status);
}
function deleteAll() {

}

server.on('addTodo', (newTodo) => {
    render(newTodo);
});

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    // console.log(todos);

    // todos.forEach((todo) => render(todo));

    // Clear list before load/reload
    list.innerHTML = '';

    // Render with for loop
    for (todo in todos) {
        render(todos[todo]);
    }
});

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
    listItemBtn.setAttribute('id', 'item');
    // listItemBtn.setAttribute('onclick', 'complete()');
    const listItemText = document.createTextNode(todo.title);
    listItemBtn.appendChild(listItemText);
    listItem.append(listItemBtn);
    list.append(listItem);

    listItemBtn.onclick = complete;

    function complete() {
        // console.log('click click boom');
        // const item = document.getElementById('item');
        // item.addEventListener('click', function(){
        //     console.log(this);
        // });
        // console.log(item.innerHTML);
        listItem.style.color = '#2ECC71';
        
        // else if (listItem.style.color = ''){
        //     listItem.style.color = '#2ECC71';
        // }
        

        console.log(listItem);
    }
}

server.on('addTodo', (newTodo) => {
    render(newTodo);
});

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    // console.log(todos);

    // todos.forEach((todo) => render(todo));
    // Render with for loop
    for (todo in todos) {
        render(todos[todo]);
    }
});

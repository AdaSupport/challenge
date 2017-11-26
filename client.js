const server = io(`http://${location.host.replace('8000', '3003')}/`);
const list = document.getElementById('todo-list');

// NOTE: This is the entirety of the app state as seen from the client side
const state = {
    todos: []
}

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function remove() {
    alert("Not implemented yet")
}

function toggleStatus() {
    alert("Not implemented yet")
}

function completeAll() {
    alert("Not implemented yet")
}

function removeAll() {
    alert("Not implemented yet")
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    state.todos = todos;
    m.redraw();
});

server.on('todo', (todo) => {
    state.todos.push(todo);
    m.redraw();
});

// NOTE: These are our render functions
const TodoItem = (todo, i) => {
    return m("li.todo-item",
            m("input[type=checkbox]", {onchange: toggleStatus}),
            m(".title", todo.title),
            m("button", {onclick: remove}, "x")
        )
}

const TodoApp = {
    view: () => {
        return [
            m("header",
                m("input#todo-input[autofocus]", {placeholder: "Feed the cat"}),
                m("button", {onclick: add}, "Make"),
            ),
            m("main",
                m("#todo-list", state.todos.map(TodoItem)),
            ),
            m("footer",
                m("button", {onclick: completeAll}, "Mark All Completed"),
                m("button", {onclick: removeAll}, "Clear List"),
            ),
        ]
    },
}

m.mount(document.body, TodoApp);

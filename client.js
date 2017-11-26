const server = io(`http://${location.host.replace('8000', '3003')}/`);
const list = document.getElementById('todo-list');

// NOTE: This is the entirety of the app state as seen from the client side
const state = {
    todos: []
}

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
const add = () => {
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

const remove = (index) => (event) => {
    if(confirm(`You want to delete <${state.todos[index].title}>?`)) {
        server.emit('remove', index)
    }
}

const toggleStatus = (index) => (event) => {
    server.emit('toggleCompletionStatus', index);
}

function completeAll() {
    if(confirm(`You want to complete all tasks?`)) {
        server.emit('completeAll');
    }
}

function removeAll() {
    if(confirm(`You want to remove all tasks?`)) {
        server.emit('removeAll');
    }
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

server.on('update', ({index, todo}) => {
    state.todos[index] = todo;
    m.redraw();
});

// NOTE: These are our render functions
const TodoItem = (todo, index) => {
    return m("li.todo-item",
            m("input[type=checkbox]", {onchange: toggleStatus(index), checked: !!todo.done}),
            m(".title", todo.title),
            m("button", {onclick: remove(index)}, "x")
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

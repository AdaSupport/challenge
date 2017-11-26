const server = io(`http://${location.host.replace('8000', '3003')}/`);
const list = document.getElementById('todo-list');

// NOTE: This is the entirety of the app state as seen from the client side
const state = {
    todos: [],
}

const saveCache = () => {
    localStorage.cacheDate = +new Date();
    localStorage.cache = JSON.stringify(state.todos);
}

const loadCache = () => {
    try {
        state.todos = JSON.parse(localStorage.cache);
    }
    catch(error) {
        state.todos = [];
    }
}

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
const add = () => {
    const input = document.getElementById('todo-input');
    server.emit('make', {title: input.value});
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
    saveCache();
    m.redraw();
});

server.on('todo', (todo) => {
    state.todos.push(todo);
    saveCache();
    m.redraw();
});

server.on('update', ({index, todo}) => {
    state.todos[index] = todo;
    saveCache();
    m.redraw();
});

// NOTE: These are our render functions
const TodoItem = (todo, index) => {
    return m(".todo-item",
        m("label",
            m("input[type=checkbox]", {onchange: toggleStatus(index), checked: !!todo.done}),
            m(".title.checkable", todo.title),
        ),
        m("button.error", {onclick: remove(index)}, "x")
    )
}

const TodoApp = {
    view: () => {
        return [
            m("header",
                m("input#todo-input[autofocus]", {placeholder: "Feed the cat"}),
                m("button", {onclick: add}, "Make"),
            ),
            m("main#todo-list", state.todos.map(TodoItem)),
            m("footer",
                server.connected
                ? [
                    `You are connected.`,
                    m("button", {onclick: completeAll}, "Mark All Completed"),
                    m("button.error", {onclick: removeAll}, "Clear List"),
                ]
                : [
                    `Cannot connect to server. Displaying todos from ${new Date(+localStorage.cacheDate).toLocaleString()}.`,
                ],
            ),
        ]
    },
}

loadCache();
m.mount(document.body, TodoApp);

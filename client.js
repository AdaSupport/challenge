const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {

    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    if(input.value === ""){
        return;
    }

    server.emit('make', {
        title : input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function completeRemaining(){
    for(let ind = 0; ind < document.getElementsByClassName("textVal").length; ind++){
        server.emit('completed', {
            title : document.getElementsByClassName("textVal")[ind].textContent
        });        
        document.getElementsByClassName("textVal")[ind].parentNode.parentNode.removeChild(document.getElementsByClassName("textVal")[ind].parentNode);
        ind--;
    };
}

function deleteRemaining(){
    for(let ind = 0; ind < document.getElementsByClassName("textVal").length; ind++){
        console.log(document.getElementsByClassName("textVal")[ind]);
        server.emit('deleted', {
            title : document.getElementsByClassName("textVal")[ind].textContent
        });        
        document.getElementsByClassName("textVal")[ind].parentNode.parentNode.removeChild(document.getElementsByClassName("textVal")[ind].parentNode);
        ind--;
    };
}

function render(todo) {
    
    const done = document.createElement('i');
    done.id = "done";
    done.classList.add("close");
    done.classList.add("material-icons");
    const doneText = document.createTextNode("check");
    done.appendChild(doneText);
    
    const listItem = document.createElement('li');
    listItem.classList.add("chip");

    const cross = document.createElement('i');
    cross.classList.add("close");
    cross.id = "cancel";
    cross.classList.add("material-icons");
    const crossText = document.createTextNode("close");
    cross.appendChild(crossText);

    const text = document.createElement('span');    
    text.classList.add("textVal");
    const listItemText = document.createTextNode(todo.title);
    text.appendChild(listItemText);
    
    listItem.appendChild(done);
    listItem.appendChild(text);
    listItem.appendChild(cross);
    list.append(listItem);    
}

function renderCompleted(complete){
    
    const listItem = document.createElement('li');
    listItem.classList.add("chip");
    
    const listItemText = document.createTextNode(complete.title);
    
    listItem.appendChild(listItemText);
    document.getElementById("completed-list").append(listItem);

}

function renderDeleted(complete){
    
    const listItem = document.createElement('li');
    listItem.classList.add("chip");
    
    const listItemText = document.createTextNode(complete.title);
    
    listItem.appendChild(listItemText);
    document.getElementById("deleted-list").append(listItem);

}
// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

server.on('loadSingular', (todo) => {
    render(todo);
});

server.on('completed', (todo) => {
    renderCompleted(todo);
});

server.on('deleted', (todo) => {
    renderDeleted(todo);
});


//Events in DOM
document.addEventListener('click',function(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    if(target.id === 'done'){
        server.emit('completed', {
            title : target.parentElement.querySelector(".textVal").textContent
        });
    }else if(target.id === 'cancel'){
        server.emit('deleted', {
            title : target.parentElement.querySelector(".textVal").textContent
        });
    }
});
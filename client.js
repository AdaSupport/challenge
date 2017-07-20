const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
var completedAll;
// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    console.log("input: "+input.value);
    // Emit the new todo as some data to the server
    server.emit('make', {
        title: input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function render(todo) {

    //Place each todo item into a div containing a checkbox and label with innerHTML == todo.title
    var div = document.createElement('div');
    div.setAttribute('class','list-item-row');
    var inputItem = document.createElement('input');

    //Helper function from accessories.js
    setAttributes(inputItem, {"type": "checkbox", "class": "checkbox"});
    
    var inputItemLabel = document.createElement('label');
    setAttributes(inputItemLabel, {"for": "boxid", "class": "strikethrough"});
    inputItemLabel.innerHTML = todo.title;
    div.append(inputItem);
    div.append(inputItemLabel);
    list.append(div);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    console.log("todos size: "+todos.length)
    $("ul").empty();
    todos.forEach((todo) => render(todo));
});

server.on('returnValue', (value)=>{
    console.log('value: '+value);
});
//Function corresponding to the Complete All button
function completeAll(){
    $(".checkbox").prop("checked",true);
    completedAll = true;
    $('#undoButton').css('display','inline-block');
}

//Function corresponding to the Undo button
function undoCompleteAll(){
    $(".checkbox").prop("checked",false);
    $('#undoButton').css('display','none');
}   

function archive(){
    var completedArray = [];
    $('label').each(function(){
        var checkbox = $(this).siblings();
        if(checkbox.is(':checked')){
            completedArray.push($(this).text());
        }
    })
    server.emit('archive',completedArray);
}


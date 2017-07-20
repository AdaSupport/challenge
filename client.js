const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
var completedAll;

var hashTable = new Hash();
var counter=0;
// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    // Emit the new todo as some data to the server
    hashTable.setItem(input.title, counter);
    counter++;
    server.emit('add', {
        title: input.value,
        completed: false
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
    hashTable = new Hash();
    counter=0;
    $("ul").empty();
    todos.forEach((todo) => {

        //populate hash table with key = todo.title, value = index of hash
        //allows us to get index of todo item by searching the title
        if(todos.length>0){
            hashTable.setItem(todo.title, counter);
            counter++;
            render(todo);
        }
    });
});

server.on('returnValue', (value)=>{
    console.log(value);
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
    var completedArrayIndex = [];
    $('label').each(function(){
        var checkbox = $(this).siblings();
        if(checkbox.is(':checked')){
            //completedArray.push
            counter--;
            completedArrayIndex.push(hashTable.getItem($(this).text()));
            
        }
    });
    server.emit('archive',completedArrayIndex);
}


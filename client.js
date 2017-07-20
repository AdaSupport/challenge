const server = io('http://localhost:3003/');
server.on('connect_error', function(err) {
  // handle server error here
  console.log('Error connecting to server');
  if (typeof(Storage) !== "undefined") {

    //FIX LOCALSTORAGE
    var todos = localStorage['offlineTodoItems'];
    console.log(todos);
    offlineLoad(JSON.parse(todos));

} else {
    alert("You are Disconnected");
}
});

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
    
    //Use local storage to save most recent list of todo items
    localStorage.setItem("offlineTodoItems",todos);
    hashTable = new Hash();
    counter=0;
    $("ul").empty();

    var localStorageStringArray = [];

    todos.forEach((todo) => {
        //hash table -> searching for title = O(1)
        if(todos.length>0){
            hashTable.setItem(todo.title, counter);
            counter++;


            //FIX THIS
            localStorageStringArray.push(todo.title);
            render(todo);
        }

    });
    console.log(localStorageStringArray);
    localStorage["offlineTodoItems"] = JSON.stringify(localStorageStringArray);
});


function offlineLoad(todos){
    hashTable = new Hash();
    counter=0;
    $("ul").empty();
    todos.forEach((todo) => {
        if(todos.length>0){
            hashTable.setItem(todo.title, counter);
            counter++;
            render({
                title: todo,
                completed: false
            });
        }
    });
}


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

//Function corresponding to the Archive button
function archive(){
    var completedArrayIndex = [];
    $('label').each(function(){
        var checkbox = $(this).siblings();
        if(checkbox.is(':checked')){
            counter--;
            completedArrayIndex.push(hashTable.getItem($(this).text()));
            
        }
    });
    server.emit('archive',completedArrayIndex);
}


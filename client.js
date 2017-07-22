const server = io('http://localhost:3003/');


const list = document.getElementById('todo-list');

var hashTable = new Hash();
var hashIndexCounter=0;
var offlineAddedTodos = [];


// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    // Emit the new todo as some data to the server
    hashTable.setItem(input.title, hashIndexCounter);
    hashIndexCounter++;
    
    //emit new todo item only if server is connected

    server.emit('add', {
        title: input.value,
        completed: false
    });
    


    // Clear the input
    input.value = '';
}

//Place each todo item into a div containing an image and span with innerHTML == todo.title
function render(todo) {
    var rowDiv = document.createElement('div');
    var imageDiv = document.createElement('div')
    rowDiv.setAttribute('class','list-item-row');
    var input = document.createElement('img');
    var imgSelector;
    if(todo.inProgress){
        imgSelector='img/check.png';
        input.className += ' check';
    } else {
        imgSelector='img/square.png';
    }
    setAttributes(input, {'src': imgSelector, 'alt':'checkbox', 'onclick': 'imageClick(this)'});

    var inputText = document.createElement('span');
    setAttributes(inputText, {'class':'checkboxText'})
    inputText.innerHTML = todo.title;
    if(todo.inProgress){
        inputText.className += ' strikethrough';
    }
    var inputItem = document.createElement('input');

    //Helper function from accessories.js
    setAttributes(inputItem, {"type": "checkbox", "class": "checkbox"});

    imageDiv.append(input);
    rowDiv.append(imageDiv);
    rowDiv.append(inputText);
    list.append(rowDiv);
}


// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    //Use local storage to save most recent list of todo items
    localStorage.setItem("offlineTodoItems",todos);
    hashTable = new Hash();
    hashIndexCounter=0;
    $("#todo-list").empty();
    $('#all-button').innerHTML = 'Complete All';

    var localStorageStringArray = [];

    todos.forEach((todo) => {
        //hash table -> searching for title = O(1)
        if(todos.length>0){
            hashTable.setItem(todo.title, hashIndexCounter);
            hashIndexCounter++;

            //push each todo item to localstorage in case of disconnect
            localStorageStringArray.push(todo.title);
            render(todo);
        }

    });
    localStorage["offlineTodoItems"] = JSON.stringify(localStorageStringArray);
});


//Function corresponding to the Delete button
var completedArrayIndex;
function Delete(){
    //Reset Uncomplete All button back to Complete All
    $('#completeall-button').html('Complete All');
    $('#completeall-button').attr('onclick', 'completeAll(this)');

    completedArrayIndex = [];
    $('img').each(function(){
        if($(this).hasClass('check')){
            hashIndexCounter--;
            var checkBoxText = $(this).parent().siblings();
            completedArrayIndex.push(hashTable.getItem(checkBoxText.text()));
        }
    });
    console.log(completedArrayIndex);
    server.emit('delete',completedArrayIndex);
}


//Event listener for disconnect from server
server.on('connect_error', function(err) {
  console.log('Error connecting to server');
  if (typeof(Storage) !== "undefined") {
    var todos = localStorage['offlineTodoItems'];
    offlineLoad(JSON.parse(todos));
} else {
    alert("You are Disconnected");
}
});


//function to load todos from localstorage
function offlineLoad(todos){
    hashTable = new Hash();
    hashIndexCounter=0;
    $("ul").empty();
    todos.forEach((todo) => {
        if(todos.length>0){
            hashTable.setItem(todo.title, hashIndexCounter);
            hashIndexCounter++;
            render({
                title: todo,
                completed: false
            });
        }
    });
}


function emitInProgress(inProgressText){
    var inProgressIndex = hashTable.getItem(inProgressText);
    console.log(inProgressIndex);
    server.emit('inProgress', inProgressIndex);

}
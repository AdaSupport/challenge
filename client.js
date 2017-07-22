const server = io('http://localhost:3003/');


const list = document.getElementById('todo-list');

var titleHashTable = new Hash();
var hashIndexCounter=0;
var offlineAddedTodos = [];
var inProgressArray = [];
var inProgressHashTable = new Hash;
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');
    //Emit input text to server only if input != empty
    if(input.value.length>0){
        titleHashTable.setItem(input.value, hashIndexCounter);
        hashIndexCounter++;


        server.emit('add', {
            title: input.value,
            completed: false
        });



    // Clear the input
    input.value = '';
}

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
    titleHashTable = new Hash();
    hashIndexCounter=0;
    $("#todo-list").empty();
    $('#all-button').innerHTML = 'Complete All';

    var localStorageStringArray = [];
    var index=0;
    todos.forEach((todo) => {
        //hash table -> searching for title = O(1)
        if(todos.length>0){
            titleHashTable.setItem(todo.title, hashIndexCounter);
            hashIndexCounter++;

            //push each todo item to localstorage in case of disconnect
            localStorageStringArray.push({
                title: todo.title
            });
            if(todo.inProgress){
                inProgressArray.push(index);
            }
            render(todo);
        }
        index++;
    });
    localStorage['inProgressArray']= JSON.stringify(inProgressArray);
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
            completedArrayIndex.push(titleHashTable.getItem(checkBoxText.text()));
        }
    });
    server.emit('delete',completedArrayIndex);
}


//Event listener for disconnect from server. Checks if browser supports local storage
server.on('connect_error', function(err) {
  console.log('Error connecting to server');
  if (typeof(Storage) !== "undefined") {
    var inProgress = localStorage['inProgressArray'];
    var todos = localStorage['offlineTodoItems'];
    offlineLoad(JSON.parse(todos),JSON.parse(inProgress));
} else {
    alert("You are Disconnected");
}
});


//function to load todos from localstorage
function offlineLoad(todos, inProgress){
    var index=0;
    titleHashTable = new Hash();
    hashIndexCounter=0;
    $("#todo-list").empty();
    todos.forEach((todo) => {
        if(todos.length>0){
            titleHashTable.setItem(todo, hashIndexCounter);
            hashIndexCounter++;

            var contains = inProgress
            var inProgressStatus= (inProgress.indexOf(index)>-1) ? true : false;
            render({
                title: todo,
                completed: false,
                inProgress: inProgressStatus
            });
        }
        index++;
    });
}


function emitInProgress(inProgressText){
    var inProgressIndex = titleHashTable.getItem(inProgressText);
    server.emit('inProgress', inProgressIndex);

}
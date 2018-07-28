# Code challenge review notes

Comments from original repo started last tuesday May 23rd, 2017

# Server.js

// Declare localhost inside of socket.io import, nope
// const server = require('socket.io')();

// Declare separate variable to get socket working, nope, ?
// const server = require('http').createServer(handler);

// Stock server implentation
// changed 'data' to todos
// function handler (req, res) {
//     fs.readFile(__dirname + '/index.html',
//         function(err, todos) {
//             if(err) {
//                 res.writeHead(500);
//                 return res.end('Error loading index.html');
//             }
//             res.writeHead(200);
//             res.end(todos);
//         }
//     );
// }

// ERR: Client not imported, nope not it
// const client = require('./client');


// Used wrong connection variable that kept server and client isolated

// ERR: double loading socket

// TypeError: Todo is not a function, FIXED, needs var?

// debugger;

// TEST EMIT
// var tweet = {user: "nodesource", text: "Hello, world!"};
// client.emit('tweet', tweet);

// client.emit('load', todos);

// Heat check, airball, returns array without titles
// console.log(todos);

// Sends a message to the client to reload all todos
// Conflicting variable names? Nope

// Send the DB downstream on connect
// Wrong order?
// net::ERR_EMPTY_RESPONSE, Might be a client side connect err, FIXED

// Make a new todo, adjusted for create function
// const newTodo = new Todo().create(title);

// Not loading client and style static files, FIXED

# Client.js

// ReferenceError: io is not defined, after importing client to server
// Conflicting variable naming?

// reload browser window
// window.location.reload()

// Might need an empty string declaration, nope needs string convert
// var todoInput = '';
// console.log(String(input.value));


// var todoInput = String(input.value);

// todo.title = input.value;

// Emit the new todo as some data to the server
// server.emit('make', {
    
    // Typo on title, missing quotes on title?
    // title: input.value
    // todo
// });

// Doesn't match Todo from component? todo != Todo
// What does a todo do? Does this know what a todo is?

// fin.addEventListener('click', change(), false );

// Not loading, at all, might not recognize db objects as todo, might be missing the initial loading

# Todo.js

// SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode

// declare string outside, nope
// var todo = new Object();

// Doesn't match todo from client, todo != Todo, nope not it

// ERR: constructor(title='') { unexpected token

// figure out how to create a todo string array
// create() {
    // todo = {title: title};
    // return {title: title};
    // return title;
// }
// create(title) {return title}
// update()
// TypeError: todo is not a function, Needs function?
// Use function from client?, nope
// create function that returns title variable
// createTodo() {
//     return title;
// }
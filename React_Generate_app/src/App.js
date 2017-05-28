import _ from 'lodash';
import React, { Component } from 'react';
import CreateTodo from './components/Create-todo.js'
import TodosList from './components/Todos-list.js'
import './App.css';

const io = require('socket.io-client')
const socket = io.connect('http://localhost:3003/'); //

const todos = [
  {
    task: 'finish Coding challenge',
    isCompleted: false
  },
];






class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        todos            //ES6 syntax like todos:todos
    };
  }

  componentDidMount() {

  socket.on('connect', (data) => {
    socket.emit('join', 'Hello World from client');
  });

  socket.on('disconnect', (data) => {
    this.setState({ todos: []});    //Clear to-dos on disconnect
  });

  let loadToDos = (todo) => {
    console.log(todo);                     // Testing console.log
    this.state.todos.push({
      task: todo.task,
      isCompleted: todo.isCompleted
    });
    this.setState({ todos: this.state.todos });
  }

  socket.on('load', (todos) => {
      // Cater to initial DB to-do list load
      if(Array.isArray(todos)){
          todos.forEach((todo) => loadToDos(todo));
      } else {                         //ELSE RENDER ONE TO-DO
          loadToDos(todos);
      }
  });

  // Handling incoming task update broadcast - status
  socket.on('incomingtaskUpdate', (todoIncoming) => {
    const foundTodo = _.find(this.state.todos, todo => todo.task === todoIncoming.task);
    foundTodo.isCompleted = todoIncoming.isCompleted;
    this.setState({ todos: this.state.todos });
  });

  // Handling incoming task delete broadcast
  socket.on('incomingtaskDelete', (todoIncomingDelete) => {
    _.remove(this.state.todos, todo => todo.task === todoIncomingDelete);
    this.setState({ todos: this.state.todos });
  });


  }


  render() {
    return (
      <div className="App">
        <h1>Welcome to the TO DO list App</h1>
        <button className="completeAllButton">Mark all tasks as completed</button>
        <CreateTodo createTask={this.createTask.bind(this)}
                    todos={this.state.todos}
        />
        <TodosList  todos={this.state.todos}
                    toggleTask={this.toggleTask.bind(this)}
                    saveTask={this.saveTask.bind(this)}
                    deleteTask={this.deleteTask.bind(this)}
        />
      </div>
    );
  }

  toggleTask = (task) => {
      const foundTodo = _.find(this.state.todos, todo => todo.task === task);
      foundTodo.isCompleted = !foundTodo.isCompleted;
      socket.emit('taskUpdate', {
        task : task,
        isCompleted: foundTodo.isCompleted
      });
      this.setState({ todos: this.state.todos });
  }

  createTask = (task) => {
    this.state.todos.push({
      task,
      isCompleted: false
    });
    // Send to sockets.io to broadcast to-do to all and store in server memory
    socket.emit('make', {
        task : task,
        isCompleted: false
    });
    this.setState({ todos: this.state.todos });
  }

  saveTask = (oldTask, newTask) => {
    const foundTodo = _.find(this.state.todos, todo => todo.task === oldTask);
    foundTodo.task = newTask;
    this.setState({ todos: this.state.todos });
  }

  deleteTask = (taskToDelete) => {
    _.remove(this.state.todos, todo => todo.task === taskToDelete);
    socket.emit('taskDelete', {
      task : taskToDelete
    });
    this.setState({ todos: this.state.todos });
  }
}

export default App;

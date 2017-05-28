import _ from 'lodash';
import React, { Component } from 'react';
import CreateTodo from './components/Create-todo.js'
import TodosList from './components/Todos-list.js'

const io = require('socket.io-client')
const socket = io.connect('http://localhost:3003/'); //



socket.on('connect', function(data) {
            socket.emit('join', 'Hello World from client');
});

const todos = [
  {
    task: 'finish Coding challenge',
    isCompleted: true
  },
  {
    task: 'eat dinner',
    isCompleted: true
  }
];

let loadToDos = (todo) => {
    console.log(todo);
}



socket.on('load', (todos) => {
    // Cater to initial DB to-do list load
    if(Array.isArray(todos)){
        todos.forEach((todo) => loadToDos(todo));
    } else {                         //ELSE RENDER ONE TO-DO
        loadToDos(todos);
    }
});




class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        todos            //ES6 syntax like todos:todos
    };
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to the TO DO list App</h1>
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

  toggleTask(task) {
      const foundTodo = _.find(this.state.todos, todo => todo.task === task);
      foundTodo.isCompleted = !foundTodo.isCompleted;
      this.setState({ todos: this.state.todos });
  }

  createTask = (task) => {
    this.state.todos.push({
      task,
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
    this.setState({ todos: this.state.todos });
  }
}

export default App;

// Component Structure
  // App
    // TodoList
      // Todo
        // completeTask()
        // deleteTask()
    // addTodo()
    // completeAllTasks()
    // deleteAllTasks()

import React, { Component } from 'react';
import TodoList from './TodoList';
import './App.css';

const todos = 
    [{
        "title" : "Order more coffee from Pilot"
    },
    {
        "title" : "Clean the coffee machine"
    },
    {
        "title" : "Sweep the floor"
    },
    {
        "title" : "Order a new display for Gordon"
    },
    {
        "title" : "Fix the charger for the speaker"
    },
    {
        "title" : "Finish making the hiring challenge"
    }]

class App extends Component {
  constructor() {
    super();
    this.state = {data: todos}
  }
  render() {
    return (
      <div>
        <TodoList todos={this.state.data}/>
      </div>
    );
  }
}

export default App;

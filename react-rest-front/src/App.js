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

class App extends Component {
  render() {
    return (
      <div>
        <TodoList />
      </div>
    );
  }
}

export default App;

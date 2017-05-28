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
      <div className="container">
        <div className="row center-block">
          <div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6">
            <h1 className="text-center">Ada's Todos</h1>
            <TodoList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

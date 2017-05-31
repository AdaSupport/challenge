import React, { Component } from 'react';
import Todo from './todo.js'


class AllTodos extends Component {
  render() {
    return (
      <div className="todos-div">
        <ul>
          <li>
            <Todo />
          </li>
        </ul>
      </div>
    );
  }
}

export default AllTodos;

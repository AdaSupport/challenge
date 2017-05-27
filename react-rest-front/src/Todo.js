import React, { Component } from 'react';
import './Todo.css'

class Todo extends Component {
  render() {
    let todo = this.props.todo;
    return (
        <li className={todo.done ? 'done' : 'normal'}>
            <input type="checkbox" onClick={() => this.props.handleItemCheck(todo)} checked={todo.done}/>
            {todo.title}
        </li>
    )
  }
}

export default Todo;
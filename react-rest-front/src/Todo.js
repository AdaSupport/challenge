import React, { Component } from 'react';
import './Todo.css'

class Todo extends Component {
  render() {
    let todo = this.props.todo;
    let doneToggle = todo.done ? 'done' : 'normal';
    let todoClassName = doneToggle+" clickableText btn-block";
    return (
        <li >
            <button className={todoClassName}
                    onClick={() => this.props.handleItemCheck(todo)}
                    checked={todo.done}
                    >
                    {todo.title}
            </button>
            <input  type="button"
                    className="btn btn-xs btn-danger btn_width-sm"
                    onClick={() => this.props.handleItemDelete(todo)} 
                    value="del"
                    />
        </li>
    )
  }
}

export default Todo;
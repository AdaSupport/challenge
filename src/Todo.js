import React, { Component } from 'react';
import './Todo.css'

class Todo extends Component {
  render() {
    let todo = this.props.todo;
    let id = this.props.id;
    let doneToggle = todo.done ? 'done' : 'normal';
    let todoClassName = doneToggle+" clickableText btn-block";
    return (
        <li className={id % 2 === 0 ? 'background-lightBlue' : 'background-lightGrey'}>
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
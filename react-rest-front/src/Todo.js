import React, { Component } from 'react';
import './Todo.css'

class Todo extends Component {
  render() {
    let todo = this.props.todo;
    return (
        <li >
            <button className={todo.done ? 'done' : 'normal'}
                    style={{background:'none', border: 'none'}}
                    onClick={() => this.props.handleItemCheck(todo)}
                    checked={todo.done}
                    >
                    {todo.title}
            </button>
            <input  type="button"
                    className="btn btn-xs btn-danger pull-right white"
                    onClick={() => this.props.handleItemDelete(todo)} 
                    value="del"
                    />
        </li>
    )
  }
}

export default Todo;
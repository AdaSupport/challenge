import React, { Component } from 'react';
import './Todo.css'

class Todo extends Component {
  render() {
    let todo = this.props.todo;
    return (
        <li className={todo.done ? 'done' : 'normal'}>
            <input type="checkbox" onClick={() => this.props.handleItemCheck(todo)} checked={todo.done}/>
            <span style={{marginLeft: '2%'}}>{todo.title}</span>
            <input type="button" className="btn btn-xs btn-danger pull-right white" onClick={() => this.props.handleItemDelete(todo)} value="del"/>
        </li>
    )
  }
}

export default Todo;
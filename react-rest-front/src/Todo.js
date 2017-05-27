import React, { Component } from 'react';

class Todo extends Component {
  render() {
    console.log(this.props.todo)
    return (
        <li>{this.props.todo.title}</li>
    )
  }
}

export default Todo;
import React, { Component } from 'react';
import Todo from './Todo';

class TodoList extends Component {
  render() {
    let todos = this.props.todos;
    let todosJSX = [];
    console.log(todos);

    todos.map((todo, i) => {
      return todosJSX.push(<Todo todo={todo} key={i} />);
    })
    return(
      <div>
        <ul>
          {todosJSX}
        </ul>
      </div>
    )
  }
    
}

export default TodoList;
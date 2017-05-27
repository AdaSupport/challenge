import React from 'react';

export default class TodoList extends React.Component {
  render() {
    const todoList = this.props.list.map(todo => {
      return (
        <li
          key={todo.id}
          onClick={() => this.props.completeTodo(todo.id)}
          className={todo.completed ? 'completed' : null}>
          {todo.title}
          <div className='close' onClick={() => this.props.deleteTodo(todo.id)}>X</div>
        </li>
      )
    });

    return <ul id='todo-list'>{ todoList }</ul>;
  }
}

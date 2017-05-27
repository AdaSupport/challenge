import React from 'react';

export default class TodoList extends React.Component {
  render() {
    const todoList = this.props.list.map(todo => {
      return (
        <li key={todo.id} className={todo.completed ? 'completed' : null}>
          <div
            className={todo.completed ? 'checkbox checked' : 'checkbox'}
            onClick={() => this.props.completeTodo(todo.id)}></div>
          {todo.title}
          <div className='close' onClick={() => this.props.deleteTodo(todo.id)}></div>
        </li>
      )
    });

    return <ul id='todo-list'>{ todoList }</ul>;
  }
}

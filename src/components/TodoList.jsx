import React from 'react';

const TodoList = ({completeTodo, deleteTodo, todoList}) => (
  <ul id='todo-list'>
    {
      todoList.map(todo => {
        return (
          <li key={todo.id} className={todo.completed ? 'completed' : null}>
            <div
              className={todo.completed ? 'checkbox checked' : 'checkbox'}
              onClick={() => completeTodo(todo.id)}></div>
            {todo.title}
            <div className='close' onClick={() => deleteTodo(todo.id)}></div>
          </li>
        )
      })
    }
  </ul>
)

export default TodoList;

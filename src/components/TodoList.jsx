import React from 'react';

const TodoList = ({completeTodo, deleteTodo, todoList}) => (
  <ul id='todo-list'>
    {
      todoList.map(todo => {
        return (
          <li key={todo.get('id')} className={todo.get('completed') ? 'completed' : null}>
            <div
              className={todo.get('completed') ? 'checkbox checked' : 'checkbox'}
              onClick={() => completeTodo(todo.get('id'))}></div>
            {todo.get('title')}
            <div className='close' onClick={() => deleteTodo(todo.get('id'))}></div>
          </li>
        )
      })
    }
  </ul>
)

export default TodoList;

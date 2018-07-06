import React from 'react';

const TodoForm = ({addTodo}) => {
  const input = document.getElementById('todo-input');

  const onAddTodo = (title) => {
    if (!title.trim()) {
      return null;
    }

    addTodo(title);
    return input.value = '';
  }

  // allow pressing the 'Enter' key to add a new Todo
  const onKeyPress = (ev) => {
    const key = ev.which;
    const title = ev.target.value;

    if (key === 13 && title.trim()) {
      return onAddTodo(title);
    }
  }

  return (
    <div>
      <input
        id="todo-input"
        type="text"
        placeholder="add task..."
        onKeyPress={onKeyPress} />
      <div className='add' onClick={() => onAddTodo(input.value)}>+</div>
    </div>
  )
}

export default TodoForm;

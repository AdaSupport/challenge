import React from 'react';

export default class TodoForm extends React.Component {
  // click to add a new Todo
  handleClick() {
    let input = document.getElementById('todo-input');

    // use trim() to prevent adding empty Todos
    input.value.trim() ? (
      this.props.addTodo(input.value),
      input.value = ''
    ) : null;
  }

  // press the 'Enter' key to add a new Todo
  handleKeyPress(event) {
    let input = event.target;

    (event.key === 'Enter' && input.value.trim()) ? (
      this.props.addTodo(input.value),
      input.value = ''
    ) : null
  }

  render() {
    return (
      <div className='form-container'>
        <input
          id="todo-input"
          type="text"
          placeholder="Feed the cat..."
          onKeyPress={this.handleKeyPress.bind(this)} />
        <button onClick={this.handleClick.bind(this)}>Add todo</button>
      </div>
    )
  }
}

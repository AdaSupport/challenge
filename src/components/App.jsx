import React from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import uuidV4 from 'uuid/v4';

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      todoList: []
    }
  }

  // adds a new Todo with passed on 'title'
  addTodo(title) {
    const newTodo = {title: title, id: uuidV4()}; // generate a unique Todo ID with 'uuid'
    const newList = this.state.todoList.slice();
    newList.push(newTodo);

    return this.setState({todoList: newList});
  }

  // deletes a Todo with passed on 'id'
  deleteTodo(id) {
    const newList = this.state.todoList.filter(todo => todo.id !== id);

    return this.setState({todoList: newList});
  }

  render() {
    return (
      <div>
        <h1>TODO APP</h1>
        <TodoForm
          addTodo={this.addTodo.bind(this)} />
        <TodoList
          list={this.state.todoList}
          deleteTodo={this.deleteTodo.bind(this)} />
      </div>
    )
  }
}

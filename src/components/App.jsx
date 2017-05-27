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
    // generate a unique Todo ID with 'uuid'
    const newTodo = {title: title, id: uuidV4(), completed: false};
    const newList = this.state.todoList.slice();
    newList.push(newTodo);

    return this.setState({todoList: newList});
  }

  // deletes a Todo with passed on 'id'
  deleteTodo(id) {
    const newList = this.state.todoList.filter(todo => todo.id !== id);

    return this.setState({todoList: newList});
  }

  // marks a Todo as completed
  completeTodo(id) {
    const newList = this.state.todoList.slice();
    newList.map(item => {
      (item.id === id) ? item.completed = true : item;
    });

    return this.setState({todoList: newList});
  }

  // deletes all Todos
  deleteAll() {
    return this.setState({todoList: []});
  }

  // marks all Todos as completed
  completeAll() {
    const newList = this.state.todoList.slice();
    newList.map(item => item.completed = true);

    return this.setState({todoList: newList});
  }

  render() {
    return (
      <div>
        <h1>TODO APP</h1>
        <TodoForm
          addTodo={this.addTodo.bind(this)}
          completeAll={this.completeAll.bind(this)}
          deleteAll={this.deleteAll.bind(this)} />
        <TodoList
          list={this.state.todoList}
          deleteTodo={this.deleteTodo.bind(this)}
          completeTodo={this.completeTodo.bind(this)} />
      </div>
    )
  }
}

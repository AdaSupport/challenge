import React from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import Header from './Header.jsx';
import io from 'socket.io-client';

const socket = io('http://localhost:3003/');

export default class App extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      todoList: []
    }
  }

  // listen to server 'state' events and update the state accordingly
  componentDidMount() {
    socket.on('state', state => this.setState(state));
  }

  addTodo(title) {
    return socket.emit('action', {type:'ADD_TODO', title});
  }

  deleteTodo(id) {
    return socket.emit('action', {type:'DELETE_TODO', id});
  }

  completeTodo(id) {
    return socket.emit('action', {type:'COMPLETE_TODO', id});
  }

  deleteAll() {
    return socket.emit('action', {type:'DELETE_ALL'});
  }

  completeAll() {
    socket.emit('action', {type:'COMPLETE_ALL'});
  }

  render() {
    return (
      <div>
        <Header
          completeAll={this.completeAll.bind(this)}
          deleteAll={this.deleteAll.bind(this)} />
        <TodoList
          list={this.state.todoList || []}
          deleteTodo={this.deleteTodo.bind(this)}
          completeTodo={this.completeTodo.bind(this)} />
        <TodoForm
          addTodo={this.addTodo.bind(this)} />
      </div>
    )
  }
}

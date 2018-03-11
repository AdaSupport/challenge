import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList from '../../components/TodoList'
import TextInput from '../../components/TextInput/TextInput'
import socketIOClient from 'socket.io-client'

import * as todoActions from  '../../actions/todos'

const socket = socketIOClient('http://localhost:3001/')

class TodoContainer extends Component {
  componentDidMount(){
    console.log('mounted');

    socket.on('load', (list) => {
      this.props.loadTodosList(list);
    })

    socket.on('action', (payload) => {
      console.log('action')
      this.actionDispatch(payload)
    })
  }

  actionDispatch = ({name, payload}) => {
    console.log(name, payload)
    switch(name){
      case 'append':
        this.props.appendOneTodo(payload);
        break;
      case 'deleteOne':
        this.props.deleteOneTodo(payload);
        break;
      case 'toggleCompleteOne':
        this.props.toggleCompletedOneTodo(payload.id, payload.completed);
        break;
      case 'toggleCompleteAll':
        this.props.toggleCompletedAllTodo(payload);
        break;
      default:
        return null
    }
  }

  onPressEnter = (text) => {
    socket.emit('action', {name:'make', payload:text});
  }

  onDelete = (id) => {
    this.props.deleteOneTodo(id);
    socket.emit('action', {name:'deleteOne', payload:id});
  }
  onToggleComplete = ({id, completed}) => {
    this.props.toggleCompletedOneTodo(id, completed);    
    socket.emit('action', {name:'toggleCompleteOne', payload:{id, completed}});
  }

  onToggleCompleteAll = () => {
    const completed = this.props.todos.some((todo) =>{return !todo.completed}) 
    this.props.toggleCompletedAllTodo(completed);
    socket.emit('action', {name:'toggleCompleteAll', payload:completed});
  }

  render() {
    const {todos} = this.props
    return (
      <div>
          <TextInput todoList={todos} 
                    onPressEnter={this.onPressEnter} 
                    onToggleCompleteAll={this.onToggleCompleteAll}/>

          <TodoList todoList={todos} 
                    onDelete={this.onDelete}
                    onToggleComplete={this.onToggleComplete}/>
      </div>
    )
  }
}
function mapStateToProps({todos}) {
  return {
    todos: todos.list
  };
}

function mapDispatchToProps(dispatch) {
  const actions = todoActions
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoContainer);
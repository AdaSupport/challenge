import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList from '../../components/TodoList'
import TextArea from '../../components/TextArea/TextArea'
import socketIOClient from 'socket.io-client'

import * as todoActions from  '../../actions/todos'

const socket = socketIOClient('http://localhost:3001/')

class TodoContainer extends Component {
  componentDidMount(){
    console.log('mounted');

    socket.on('load', (list) => {
      this.props.loadTodosList(list);
    })

    socket.on('append', (todo) => {
      this.props.appendOneTodo(todo);
    })

    socket.on('deleteOne', (todo) => {
      this.props.deleteOneTodo(todo.id);
    })

    socket.on('toggleCompleteOne', ({id, completed}) => {
      this.props.toggleCompletedOneTodo(id, completed);
    })
  }

  onPressEnter = (text) => {
    socket.emit('make', text);
  }

  onDelete = (id) => {
    this.props.deleteOneTodo(id);
    socket.emit('deleteOne', id);
  }
  onToggleComplete = ({id, completed}) => {
    this.props.toggleCompletedOneTodo(id, completed);    
    socket.emit('completeOne', {id, completed})
  }

  render() {
    const {todos} = this.props
    return (
      <div>
          <TextArea onPressEnter={this.onPressEnter}/>
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
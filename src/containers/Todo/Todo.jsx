import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList from '../../components/TodoList'
import TextArea from '../../components/TextArea/TextArea'
import socketIOClient from 'socket.io-client'

import * as todoActions from  '../../actions/todos'

const socket = socketIOClient('http://localhost:3001/')

class Todo extends Component {
  componentDidMount(){
    console.log(this.props)
    console.log('mounted');
    socket.on('load', (data) => {
      this.props.loadTodosList(data)
      console.log(this.props.todos)
    })
  }
  render() {
    const {todos} = this.props
    return (
      <div>
          <TextArea />
          <TodoList todoList={todos}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Todo);
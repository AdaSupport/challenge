import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import TodoList from '../../components/TodoList'
import TextArea from '../../components/TextArea/TextArea'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient('http://localhost:3001/')

export default class Home extends Component {
  componentDidMount(){
    console.log('mounted');
    socket.on('load', (data) => {
      console.log(data)
    })
  }
  render() {
    return (
      <div>
          <TextArea />
          <TodoList />
      </div>
    )
  }
}

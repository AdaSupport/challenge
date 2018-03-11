import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import TodoList from '../../components/TodoList'
import TextArea from '../../components/TextArea/TextArea'

export default class Home extends Component {
  render() {
    return (
      <div>
          <TextArea />
          <TodoList />
      </div>
    )
  }
}

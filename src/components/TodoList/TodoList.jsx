import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import Todo from '../Todo'

export default class TodoList extends Component {
  render() {
    return (
      <div>
        <Container>
          <Todo />
          <Todo />
          <Todo />
        </Container>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Container, Segment } from 'semantic-ui-react'
import Todo from '../Todo'

export default class TodoList extends Component {
  render() {
    return (
      <div>
        <Container>
          <Segment.Group raised>
            <Todo />
            <Todo />
            <Todo />
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Container, Segment, List } from 'semantic-ui-react'
import Todo from '../Todo'

export default class Footer extends Component {

  render() {
    const { todoList } = this.props
    return (
      <div>
          <Segment basic textAlign='right' size='tiny'>
            <List link horizontal floated='right' relaxed='very'>
              <List.Item onClick={this.props.onRemoveAll}>
                <List.Icon name='remove' fitted/>
                <List.Content>Delete all</List.Content>
              </List.Item>
            </List>
          </Segment>
          
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Container, Segment, List } from 'semantic-ui-react'
import Todo from '../Todo'

const UserNum = ({userNum}) => {
  let text = ''
  if(userNum > 1) {
    text = `${userNum} users are online`;
  }else if( userNum === 1){
    text = 'Only you is online';
  }else{
    text = 'You are offline';
  }
  return (
    <List.Item>
      <List.Content>
        {text}
      </List.Content>
    </List.Item>
  )
}

export default class Footer extends Component {



  render() {
    const { todoList } = this.props
    return (
      <div>
          <Segment basic size='tiny'>
            <List link horizontal>
              <UserNum userNum={this.props.userNum}/>
            </List>
            <List link horizontal floated='right'>
              <List.Item  onClick={this.props.onRemoveAll}>
                <List.Icon name='remove' fitted/>
                <List.Content>Delete all</List.Content>
              </List.Item>
            </List>
          </Segment>
          
      </div>
    )
  }
}

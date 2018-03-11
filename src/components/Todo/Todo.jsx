import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'


const TodoText = ({text}) => {
  return (<span>{text}</span>)
}

export default class Todo extends Component {
  render() {
    const {title, id, completed} = this.props
    console.log(title, id, completed)
    if (title){
      return (
        <div>
          <Segment>
            <TodoText text={title}/>
          </Segment>
        </div>
      )
    }
    return null

  }
}

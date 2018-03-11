import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
const style = {
  margin: '8px 0',
  padding: '16px'
}

export default class Todo extends Component {
  render() {
    return (
      <div>
        <Segment raised style={style}>
          Pellentesque habitant morbi tristique senectus.
        </Segment>
      </div>
    )
  }
}

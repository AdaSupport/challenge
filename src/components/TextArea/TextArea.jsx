import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'

export default class TextArea extends Component {
  render() {
    return (
      <div>
        <Input fluid placeholder='What to do next...' />
      </div>
    )
  }
}

import React, { Component } from 'react';
import { Header, Container} from 'semantic-ui-react';
const style = {
  marginBottom:'5%'
}

export default class Layout extends Component {
  render() {
    return (
      <div >
        <Header as='h1' content='Real Time Todo App' textAlign='center'/>
        <Container text style={style}>
          {this.props.children}
        </Container>
      </div>
    )
  }
}
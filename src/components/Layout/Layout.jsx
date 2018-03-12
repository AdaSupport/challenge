import React, { Component } from 'react';
import { Header, Container} from 'semantic-ui-react';
import style from './style'

//simple layout using semantic ui
export default class Layout extends Component {
  render() {
    return (
      <div >
        <Header as='h1' style={style.header} content='Real Time Todo App' textAlign='center'/>
        <Container text style={style.container}>
          {this.props.children}
        </Container>
      </div>
    )
  }
}
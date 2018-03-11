import React, { Component } from 'react';
import { Header, Container, Grid } from 'semantic-ui-react';

import style from './style'

export default class Layout extends Component {
  render() {
    return (
      <div >
        <Header as='h1' content='Real Time Todo App' textAlign='center'/>
        <Container text>
          {this.props.children}
        </Container>
      </div>
    )
  }
}
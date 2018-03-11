import React, { Component } from 'react';
import Todo from '../Todo';
import Layout from '../../components/Layout'

export default class App extends Component {
    
  render() {
    return (
      <div>
        <Layout>
          <Todo />
        </Layout>
      </div>
    )
  }
}


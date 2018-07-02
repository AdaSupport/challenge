import React, { Component } from 'react';
import TodoContainer from '../TodoContainer';
import Layout from '../../components/Layout'

//root app
export default class App extends Component {
    
  render() {
    return (
      <div>
        <Layout>
          <TodoContainer />
        </Layout>
      </div>
    )
  }
}


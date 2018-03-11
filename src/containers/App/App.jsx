import React, { Component } from 'react';
import Home from '../Home';
import Layout from '../../components/Layout'

export default class App extends Component {
    
  render() {
    return (
      <div>
        <Layout>
          <Home />
        </Layout>
      </div>
    )
  }
}


import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header>
        TODO APP
        <div className='checkbox all' onClick={() => this.props.completeAll()}></div>
        <div className='close all' onClick={() => this.props.deleteAll()}></div>
      </header>
    )
  }
}

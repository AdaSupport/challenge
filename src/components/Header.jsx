import React from 'react';

const Header = ({completeAll, deleteAll}) => (
  <header>
    TODO APP
    <div className='checkbox all' onClick={() => completeAll()}></div>
    <div className='close all' onClick={() => deleteAll()}></div>
  </header>
)

export default Header;

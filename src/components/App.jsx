import React from 'react';
import { connect } from 'react-redux';

import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import Header from './Header.jsx';
import * as actions from '../actions';

const App = ({deleteAll, completeAll, todoList, deleteTodo, completeTodo, addTodo}) => (
  <div>
    <Header
      deleteAll={deleteAll}
      completeAll={completeAll} />
    <TodoList
      todoList={todoList || []}
      deleteTodo={deleteTodo}
      completeTodo={completeTodo} />
    <TodoForm
      addTodo={addTodo} />
  </div>
);

export const AppContainer = connect(state => ({todoList: state.get('todoList')}), actions)(App);

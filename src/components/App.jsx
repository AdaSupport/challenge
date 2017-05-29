import React from 'react';

import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import Header from './Header.jsx';

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

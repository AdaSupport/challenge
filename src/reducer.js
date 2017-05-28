import { List, Map } from 'immutable';
import uuidV4 from 'uuid';

const INITIAL_STATE = Map();

// updates state with a new Todo based on the passed title and randomly generated id
function addTodo(state, title) {
  const newTodo = Map({title, id: uuidV4(), completed: false});
  return state.updateIn(['todoList'], list => list.push(newTodo));
}

// sets {completed: true} for all Todos
function completeAll(state) {
  return state.updateIn(['todoList'], item => item.map(elem => elem.set('completed', true)));
}

// sets {completed: true} for a specified Todo
function completeTodo(state, id) {
  const index = state.get('todoList').findIndex(item => item.get('id') === id);
  return state.setIn(['todoList', index, 'completed'], true);
}

// initiates the state with an empty Todo list
function deleteAll(state) {
  return state.set('todoList', List());
}

// deletes a Todo from the state
function deleteTodo(state, id) {
  const index = state.get('todoList').findIndex(item => item.get('id') === id);
  return state.deleteIn(['todoList', index]);
}

// load initial Todos
function loadTodos(state, todoList) {
  return state.set('todoList', todoList);
}

// reducer function for Redux store
export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_TODO'     : return addTodo(state, action.title);
    case 'COMPLETE_ALL' : return completeAll(state);
    case 'COMPLETE_TODO': return completeTodo(state, action.id);
    case 'DELETE_ALL'   : return deleteAll(state);
    case 'DELETE_TODO'  : return deleteTodo(state, action.id);
    case 'LOAD_TODOS'   : return loadTodos(state, action.todoList);
  }

  return state;
}

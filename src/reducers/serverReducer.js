import { List, Map, fromJS } from 'immutable';
import uuidV4 from 'uuid';

const INITIAL_STATE = Map();

// helper function to get the index of the Todo with assigned ID
const getIndex = (state, id) => {
  return state.get('todoList').findIndex(item => item.get('id') === id);
}

const serverReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo = Map({title: action.title, id: uuidV4(), completed: false});
      return state.updateIn(['todoList'], list => list.push(newTodo));

    case 'COMPLETE_ALL':
      return state.updateIn(['todoList'], item => item.map(elem => elem.set('completed', true)));

    case 'COMPLETE_TODO':
      return state.setIn(['todoList', getIndex(state, action.id), 'completed'], true);

    case 'DELETE_ALL' :
      return state.set('todoList', List());

    case 'DELETE_TODO':
      return state.deleteIn(['todoList', getIndex(state, action.id)]);

    case 'LOAD_TODOS':
      return state.set('todoList', fromJS(action.todoList));
  }

  return state;
}

export default serverReducer;

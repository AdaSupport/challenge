import {LOAD_TODOS_LIST, APPEND_ONE_TODO, DELETE_ONE_TODO} from '../../actions/todos'

const initial_state = {
  list:[]
}

const removeById = (list, id) => {
  return list.filter((e) => { return e.id !== id});
}

export default function todos(state=initial_state, action) {
  switch (action.type) {
    case LOAD_TODOS_LIST:
      return {...state, list:action.list};
    case APPEND_ONE_TODO:
      return {...state, list:[...state.list, action.todo]};
    case DELETE_ONE_TODO:
      return {...state, list:removeById(state.list, action.id)};
    default:
      return state;
  }
}
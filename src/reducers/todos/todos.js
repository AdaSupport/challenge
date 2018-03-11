import {LOAD_TODOS_LIST, APPEND_ONT_TODO} from '../../actions/todos'

const initial_state = {
  list:[]
}

export default function todos(state=initial_state, action) {
  switch (action.type) {
    case LOAD_TODOS_LIST:
      return {...state, list:action.list};
    case APPEND_ONT_TODO:
      return {...state, list:[...state.list, action.todo]};
    default:
      return state;
  }
}
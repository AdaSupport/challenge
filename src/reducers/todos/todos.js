import {LOAD_TODOS_LIST} from '../../actions/todos'

const initial_state = {
  list:[]
}

export default function todos(state=initial_state, action) {
  switch (action.type) {
    case LOAD_TODOS_LIST:
      return {...state, list:action.list};
    default:
      return state;
  }
}
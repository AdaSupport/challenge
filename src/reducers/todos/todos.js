import {LOAD_TODOS_LIST, 
        APPEND_ONE_TODO, 
        DELETE_ONE_TODO, 
        TOGLLE_COMPLETE_TODO,
        TOGLLE_COMPLETE_ALL_TODO,
        DELETE_ALL} from '../../actions/todos'

const initial_state = {
  list:[]
}

const removeById = (list, id) => {
  return list.filter((e) => { return e.id !== id});
}

const toggleCompleteById = (list, id, completed) => {
  return list.map((e) => {
    if(e.id === id){
      e.completed = completed;
    }
    return e
  })
}

const toggleAllComplete = (list, completed) => {
  return list.map((todo)=>{
    todo.completed = completed
    return todo
  });
}

export default function todos(state=initial_state, action) {
  switch (action.type) {
    case LOAD_TODOS_LIST:
      return {...state, list:action.list};

    case APPEND_ONE_TODO:
      return {...state, list:[...state.list, action.todo]};

    case DELETE_ONE_TODO:
      return {...state, list:removeById(state.list, action.id)};

    case DELETE_ALL:
      return {...state, list:[]}
      
    case TOGLLE_COMPLETE_TODO:
      return {...state, list: toggleCompleteById(state.list, action.id, action.completed)};

    case TOGLLE_COMPLETE_ALL_TODO:
      return {...state, list: toggleAllComplete(state.list, action.completed)};

    default:
      return state;
  }
}
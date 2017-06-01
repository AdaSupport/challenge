export default function reducer(state={
  todos: {
    todos: []
  }
}, action) {
  switch (action.type) {
    case "SHOW_TODOS":
      return {...state,
        todos: {
          todos: action.todos.todos
        }
      }
      case "ADD_TODO":
        let todoArray = state.todos.todos
        todoArray.push(action.todo.todo)
        return {...state,
          todos: {
            todos: todoArray,
          }
        }
        case "REMOVE_TODO":
          let todos = state.todos.todos
          todos.map((todo, index)=>{
            if(todo.title === action.todo.todo){
              todos.splice(index, 1)
            }
          })
          return {...state,
            todos: {
              todos: todos,
              todo : action.todo.todo,
            }
          }
          case "REMOVE_ALL":
            return {...state,
              todos: {
                todos: []
              }
            }
    default:
      return state;
  }
}

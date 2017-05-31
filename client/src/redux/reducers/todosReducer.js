export default function reducer(state={
  todos: {
    todos: null
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
          let reducedTodos = todos.map((todo, index)=>{
            if(todo.title === action.todo.todo){
              todos.splice(index, 1)
              debugger
            }
          })
          return {...state,
            todos: {
              todos: todos,
              todo : action.todo.todo
            }
          }
    default:
      return state;
  }
}

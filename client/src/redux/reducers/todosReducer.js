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
    default:
      return state;
  }
}

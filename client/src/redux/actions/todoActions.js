export const showTodos = (todos) => {
  return {
    type: "SHOW_TODOS",
    todos
  }
}

export const addTodo = (todo) => {
  return {
    type: "ADD_TODO",
    todo
  }
}

export const removeTodo = (todo) => {
  return {
    type: "REMOVE_TODO",
    todo
  }
}

export const removeAll = () => {
  return {
    type: "REMOVE_ALL"
  }
}

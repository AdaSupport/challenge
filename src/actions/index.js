export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  }
}

export function addTodo(title) {
  return {
    type:'ADD_TODO',
    title
  }
}

export function deleteTodo(id) {
  return {
    type: 'DELETE_TODO',
    id
  }
}

export function completeTodo(id) {
  return {
    type: 'COMPLETE_TODO',
    id
  }
}

export function deleteAll() {
  return {
    type: 'DELETE_ALL'
  }
}

export function completeAll() {
  return {
    type: 'COMPLETE_ALL'
  }
}

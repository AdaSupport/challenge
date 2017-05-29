export function setState(state) {
  return {
    type: 'SET_STATE',
    remote: false,
    state
  }
}

export function addTodo(title) {
  return {
    type:'ADD_TODO',
    remote: true,
    title
  }
}

export function deleteTodo(id) {
  return {
    type: 'DELETE_TODO',
    remote: true,
    id
  }
}

export function completeTodo(id) {
  return {
    type: 'COMPLETE_TODO',
    remote: true,
    id
  }
}

export function deleteAll() {
  return {
    type: 'DELETE_ALL',
    remote: true
  }
}

export function completeAll() {
  return {
    type: 'COMPLETE_ALL',
    remote: true
  }
}

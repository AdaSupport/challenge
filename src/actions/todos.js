export const LOAD_TODOS_LIST = 'LOAD_TODOS_LIST';
export const APPEND_ONE_TODO = 'APPEND_ONE_TODO';
export const DELETE_ONE_TODO = 'DELETE_ONE_TODO';
export const TOGLLE_COMPLETE_TODO = 'TOGLLE_COMPLETE_TODO';

export function loadTodosList(todosList) {
  return {
    type: LOAD_TODOS_LIST,
    list:todosList
  };
}

export function appendOneTodo(todo) {
  if(todo && todo.title && todo.id){
    return {
      type: APPEND_ONE_TODO,
      todo
    };
  }
}

export function deleteOneTodo(id) {
  if(id){
    return {
      type: DELETE_ONE_TODO,
      id
    };
  }
}

export function toggleCompletedOneTodo(id, completed) {
  if(id){
    return {
      type: TOGLLE_COMPLETE_TODO,
      id,
      completed
    };
  }
}


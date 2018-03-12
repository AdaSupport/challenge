export const LOAD_TODOS_LIST = 'LOAD_TODOS_LIST';
export const APPEND_ONE_TODO = 'APPEND_ONE_TODO';
export const DELETE_ONE_TODO = 'DELETE_ONE_TODO';
export const DELETE_ALL      = 'DELETE_ALL';
export const TOGLLE_COMPLETE_TODO = 'TOGLLE_COMPLETE_TODO';
export const TOGLLE_COMPLETE_ALL_TODO = 'TOGLLE_COMPLETE_ALL_TODO';
export const UPDATE_TITLE_BY_ID = 'UPDATE_TITLE_BY_ID';

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

export function deleteAll() {
  return {
    type: DELETE_ALL
  };
}

export function toggleCompletedOneTodo(id, completed) {
  console.log('in action',id, completed)
  if(id){
    return {
      type: TOGLLE_COMPLETE_TODO,
      id,
      completed
    };
  }
}

export function toggleCompletedAllTodo(completed) {
  return {
    type: TOGLLE_COMPLETE_ALL_TODO,
    completed
  }
}

export function updateTitleById({id, title, isEditing}){
  return {
    type: UPDATE_TITLE_BY_ID,
    id,
    title,
    isEditing
  }
}

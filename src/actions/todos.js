export const LOAD_TODOS_LIST = 'LOAD_TODOS_LIST';
export const APPEND_ONT_TODO = 'APPEND_ONT_TODO';

export function loadTodosList(todosList) {
  return {
    type: LOAD_TODOS_LIST,
    list:todosList
  };
}

export function appendOneTodo(todo) {
  console.log('action', todo)
  if(todo && todo.title && todo.id){
    return {
      type: APPEND_ONT_TODO,
      todo
    };
  }
}


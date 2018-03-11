export const LOAD_TODOS_LIST = 'LOAD_TODOS_LIST';

export function loadTodosList(todosList) {
  return {
    type: LOAD_TODOS_LIST,
    list:todosList
  };
}
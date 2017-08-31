var {
  create,
  deleteTodo,
  deleteAll,
  complete,
  completeAll,
  incomplete,
} = require('./actions')

// add new item from input field
function add() {
  const input = document.getElementById('todo-input')
  if (input.value === '') return
  create(input.value)
  input.value = ''
  input.focus()
}

// add onclick methods to static buttons
function setupButtons() {
  window.addEventListener(
    'load',
    function() {
      const createTodo = document.getElementById('createTodo')
      createTodo.onclick = add

      const completeAllBtn = document.getElementById('completeAll')
      completeAllBtn.onclick = completeAll

      const deleteAllBtn = document.getElementById('deleteAll')
      deleteAllBtn.onclick = deleteAll
    },
    false
  )
}

/** CompleteButton - create a 'mark complete' button
  * @param {Todo} - a todo item
  */
function CompleteButton(todo) {
  const completeBtn = document.createElement('button')
  completeBtn.classList.add('complete-button')
  // svg shamelessly stolen from Asana
  completeBtn.innerHTML = `<svg class="Icon CheckIcon TaskRowCompletionStatus-checkIcon ${todo.completed &&
    'complete'}" title="CheckIcon" viewBox="0 0 32 32"> <polygon points="27.672,4.786 10.901,21.557 4.328,14.984 1.5,17.812 10.901,27.214 30.5,7.615 " /></svg>`
  completeBtn.onclick = todo.completed
    ? function() {
        incomplete(todo)
      }
    : function() {
        complete(todo)
      }

  return completeBtn
}

/** TodoItem - create a todo item
  * @param {Todo} - a todo item
  */
function TodoItem(todo) {
  const listItem = document.createElement('li')
  const listItemText = document.createElement('p')
  const deleteBtn = document.createElement('button')

  listItem.id = `id-${todo.id}`
  listItemText.innerHTML = todo.title
  listItemText.style.color = todo.completed ? '#a4a4a4' : '#333'
  deleteBtn.innerHTML = 'delete'
  deleteBtn.onclick = function() {
    deleteTodo(todo)
  }

  listItem.appendChild(CompleteButton(todo))
  listItem.appendChild(listItemText)
  listItem.appendChild(deleteBtn)

  return listItem
}

module.exports = { setupButtons, TodoItem, CompleteButton }

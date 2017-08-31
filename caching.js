// Save DB to localStorage
function saveDB(DB) {
  localStorage.setItem('DB', JSON.stringify(DB))
}

// Get DB from localStorage
function getDB() {
  return JSON.parse(localStorage.getItem('DB'))
}

// get todo item with id
function get(id) {}

// insert todo item into cache
function insert(todo) {}

module.exports = { saveDB, getDB }

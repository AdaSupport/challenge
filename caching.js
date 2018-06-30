// Save DB to localStorage
function saveDB(DB) {
  localStorage.setItem('DB', JSON.stringify(DB))
}

// Get DB from localStorage
function getDB() {
  return JSON.parse(localStorage.getItem('DB'))
}

module.exports = { saveDB, getDB }

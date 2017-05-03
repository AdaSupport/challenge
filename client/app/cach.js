module.exports.cach = class Cach {

  // Set items to cach
  setItems (todoItems) {
    this.clear();
    todoItems.map( (todo) => {this.addItem(todo)} );
  }

  // Add todo to existing cach
  addItem (todo) {
    var todosSaved = this.get();
    localStorage.setItem(todo._id, JSON.stringify(todo));
  };

  // Chek item by key
  checkItem (key) {
    var item = JSON.parse(localStorage[key]);
    item['isChecked'] = !item['isChecked'];
    localStorage.setItem(key, JSON.stringify(item));
  };

  // Check all items
  checkAll () {
    var cachedItems = this.get().forEach((todo) => { this.checkItem(todo._id) } );
  };

  //Get cached data
  get() {
    var values = [], data = [];
    var keys = Object.keys(localStorage).map((key) => parseInt(key));
    keys.sort(function(a,b){return b - a}); // to enshure that the orer of items is kept
    keys.map((key) => data.push(JSON.parse(localStorage.getItem(key))));
    return data;
  };

  // Remove item by id
  removeItem (id) {
    localStorage.removeItem(id);
  };

  // Clear cach
  clear () {
    localStorage.clear();
  };
}
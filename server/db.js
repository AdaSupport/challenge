const DEFAULT_DATA_PATH = '../DB/data.json'
// const DEFAULT_DATA_PATH = '../DB/data.test.json'

const fs      = require('fs')
const path    = require('path')
const {Todo}    = require('./todo');

function writeToFile(jsonObj, file_path){
  fs.writeFileSync(
    path.join(__dirname, file_path), 
    JSON.stringify(jsonObj, undefined, 4), 
    'utf-8', 
    (err) => {
      if(err){
        console.error(err);
        return err;
      }
    }
  );
}

class DB {
  constructor() {
    this.todos = [];
    this.path  = '';
  }

  connect(dataPath=DEFAULT_DATA_PATH){
    //check file exisitence
    const exists = fs.existsSync(path.join(__dirname, dataPath));
    if(!exists){return exists};

    //read data
    this.path = dataPath;
    const file_path = path.join(__dirname, this.path);
    const rawData = JSON.parse(fs.readFileSync(file_path)) || [];

    //if any of the todos does not contain id, 
    //then update the json file to give every todo a id
    let needUpdateFile = false;
    this.todos = rawData.map(({title, id, completed}) => { 
      if(!id && !needUpdateFile){ needUpdateFile = true};
      return new Todo(title, id, completed);
    }) || [];

    if(needUpdateFile){
      this.writeTodosToFile();
    }
    return exists;
  }

  writeTodosToFile() {
    const todoList = this.todos.map(({title, id, completed}) => {
      return {title, id, completed};
    });
    writeToFile(todoList, this.path);
  }

  /**
  * return all todos 
  * @return {list} - all todos.
  */
  getAllTodos() {
    return this.todos;
  }


  /**
  * return first todos    
  * @return {Object} - the first todo
  */
  getFirst() {
    return this.todos[0];
  }

  /**
  * return last todos  
  * @return {Object} - the last todo
  */
  getLast() {
    return this.todos[this.todos.length - 1 ];
  }

  /**
  * return the todo with the request id
  * @param {string}   id - id requested
  * @return {Object}  - the first todo with the request id
  */
  getById(id){
    return this.todos.filter((todo) => todo.id === id)[0];
  }

  /**
  * return the todo with the request title
  * @param {string}  title - title requested
  * @return {Object}  - the first todo with the request title
  */
  getByTitle(title){
    return this.todos.filter((todo) => todo.title === title)[0];
  }

  /**
  * insert a new todo and store it to db file
  * @param {string}  title - the new todo title
  * @return {Object} - the todo inserted
  */
  insertOne(title, id){
    const todo = new Todo(title, id);
    this.todos.push(todo);
    return todo;
    this.writeTodosToFile()
  }
  updateAllTodos(list){
    this.todos = [];
    //only insert valid one
    list.forEach((todo) => {
      if(todo.title && todo.id && todo.completed != null && todo.isEditing !== null){
        this.todos.push(todo)
      }
    })
    console.log('update all todos', this.todos)
    this.writeTodosToFile()
    
  }

  /**
  * delete a todo by id
  * @param {string}  id - the id of todo needed to be deleted
  * @return {Object} - the todo deleted
  */
  deleteOneById(id){
    return this._deleteOne('id', id);
  }
  
  /**
  * delete a todo by title
  * @param {string}  title - the title of todo needed to be deleted
  * @return {Object} - the todo deleted
  */
  deleteOneByTitle(title){
    return this._deleteOne('title', title);
  }

  _deleteOne(type, val){
    let deletedTodo = null;
    const todos = this.todos.filter((todo) =>{
      if(todo[type] === val){
        deletedTodo = todo;
        return false;
      }else{
        return true;
      }
    });
    if(deletedTodo){
      this.todos = todos;
      this.writeTodosToFile()
    }
    return deletedTodo
  }

  /**
  * toggle all completed
  * @param {boolean}  completed - completed or not
  */
  deleteAll(){
    this.todos = []
    this.writeTodosToFile()
    
  }

  /**
  * toggle a todo  completed by id
  * @param {string}  id - the id of todo needed to be toggled
  * @param {boolean}  completed - the todo completed or not
  * @return {Object} - the todo toggled
  */
  toggleCompletedOneById(id, completed){
    let todoToggled = null;
    this.todos.forEach((todo) => {
      if (todo.id === id) {
        todo.completed = completed;
        todoToggled = todo;
        return;
      }
    })
    this.writeTodosToFile()    
    return todoToggled;
  }

  /**
  * toggle all completed
  * @param {boolean}  completed - completed or not
  */
  toggleCompletedAll(completed){
    this.todos.forEach((todo) => {
      todo.completed = completed;
    })
    this.writeTodosToFile()    
  }


  //for show editing
  updateTitleById(id, title){
    this.todos.forEach((todo) => {
      if(todo.id === id){
        todo.title = title;
      }
    })
    this.writeTodosToFile()  
  }
};

module.exports = {
  Database: DB
}

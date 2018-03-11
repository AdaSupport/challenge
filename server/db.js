const DATA_PATH = '../DB/data.json'

const fs      = require('fs')
const path    = require('path')
const rawData = require(DATA_PATH);
const Todo    = require('./todo');

function writeToFile(jsonObj){
  fs.writeFileSync(
    path.join(__dirname, DATA_PATH), 
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
    //if any of the todos does not contain id, 
    //then update the json file to give every todo a id
    let needUpdateFile = false;

    this.todos = rawData.map((todo) => { 
      if(!todo._id && needUpdateFile === false){ needUpdateFile = true};
      return new Todo(todo.title, todo._id);
    }) || [];

    if(needUpdateFile){
      writeTodosToFile(this.todos);
    }
  }

  writeTodosToFile() {
    const todoList = todos.map((todo) => {return {title: todo.title, _id: todo.id}});
    writeToFile(todoList);
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
    return this.todos.filter((todo) => todo._id === id)[0];
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
  insertOne(title){
    const todo = new Todo(title);
    this.todos.push(todo);
    return todo;
  }

  /**
  * delete a todo by id
  * @param {string}  id - the id of todo needed to be deleted
  * @return {Object} - the todo deleted
  */
  deleteOneById(id){
    return this._deleteOne('id', title);
  }
  

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
    }
    return deletedTodo
  }
};

module.exports = {
  DB: new DB()
}

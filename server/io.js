const httpServer =require('http').Server
const socketIO = require('socket.io');

const {Database} = require('../server/db');

class IO {
  constructor(server){
    if(!server || ! server instanceof httpServer){
      throw new Error('failed to initial IO server');
    }
    this.DB = new Database();
    this.DB.connect();
    this.io = socketIO(server);
  }
  reloadTodos(){
    return this.DB.getAllTodos();
  }

  newTodo(text){
    const todo = this.DB.insertOne(text);
    this.io.emit('append', todo);
  }

  deleteTodo(id){
    const todo = this.DB.deleteOneById(id);
    this.io.emit('deleteOne', todo);
    
  }

  listen(){
    this.io.on('connection', (client) => {
      console.log(`connected ${client.id}`);
      client.emit('load', this.reloadTodos());

      client.on('make', (title) => {
        this.newTodo(title)
      })

      client.on('delete', (id) => {
        this.deleteTodo(id)
      })
    })
  }
};

module.exports.IO = IO
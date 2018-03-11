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

  listen(){
    this.io.on('connection', (client) => {
      console.log(`connected ${client.id}`);
      client.emit('load', this.reloadTodos());

      client.on('make', (title) => {
        const todo = this.DB.insertOne(title);
        this.io.emit('append', todo);
      })

      client.on('deleteOne', (id) => {
        const todo = this.DB.deleteOneById(id);
        client.broadcast.emit('deleteOne', todo);
      })

      client.on('completeOne', ({id, completed}) => {
        const todo = this.DB.toggleCompletedOneById(id, completed);
        client.broadcast.emit('toggleCompleteOne', todo);
      })
    })
  }
};

module.exports.IO = IO
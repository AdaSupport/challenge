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

  actionDispatch(client, {name, payload=''}){
    let ret
    switch(name){
      case 'deleteOne':
        ret = this.DB.deleteOneById(payload);
        client.broadcast.emit('action', {name, payload:ret.id});
        break;
      
      case 'deleteAll':
        ret = this.DB.deleteAll();
        client.broadcast.emit('action', {name});
        break;

      case 'toggleCompleteOne':
        ret = this.DB.toggleCompletedOneById(payload.id, payload.completed);
        client.broadcast.emit('action', {name, payload:ret});
        break;
      
      case 'toggleCompleteAll':
        this.DB.toggleCompletedAll(payload);
        client.broadcast.emit('action', {name, payload});
        break;

      case 'make':
        ret = this.DB.insertOne(payload);
        this.io.emit('action', {name:'append', payload:ret});
        break;

      default:
        return null
    }
  }

  listen(){
    this.io.on('connection', (client) => {
      console.log(`connected ${client.id}`);
      client.emit('load', this.reloadTodos());


      client.on('action', (payload) => {
        console.log(payload)
        this.actionDispatch(client, payload);
      })
    })
  }
};

module.exports.IO = IO
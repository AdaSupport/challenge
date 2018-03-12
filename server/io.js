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
        if(ret){
          client.broadcast.emit('action', {name, payload:payload});
        }
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

      case 'updateWholeList':
        this.DB.updateAllTodos(payload);
        client.broadcast.emit('updateWholeList', payload);
        break;

      case 'make':
        ret = this.DB.insertOne(payload.title, payload.id);
        client.broadcast.emit('action', {name:'append', payload:ret});
        break;

      case 'editing':
        console.log('editing')
        client.broadcast.emit('action', {name, payload})
        break;
      case 'editDone':
        console.log('editing done')
        this.DB.updateTitleById(payload.id, payload.title)
        client.broadcast.emit('action', {name, payload})
        break;
      default:
        return null
    }
  }

  broadcastUserNums(){
    this.io.clients((err, clients) => {
      if(err) throw err;
      this.io.emit('updateUserNum', clients.length);
    })
  }

  listen(){
    this.io.on('connection', (client) => {
      console.log(`connected ${client.id}`);
      this.broadcastUserNums()
      // on intial, first let client know the current list
      client.emit('initial', this.DB.getAllTodos())
      client.on('initialAck', ({isOffLinePrev, mergedList} )=> {
        if(isOffLinePrev){
          this.actionDispatch(client, {name:'updateWholeList', payload:mergedList})
        }
      })


      client.on('action', (payload) => {
        console.log(payload)
        this.actionDispatch(client, payload);
      })
      client.on('disconnect', () => {
        console.log('disconnect')
        this.broadcastUserNums()
      })

      
    })

    
  }
};

module.exports.IO = IO
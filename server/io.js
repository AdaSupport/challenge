const httpServer =require('http').Server
const socketIO = require('socket.io');

const {Database} = require('../server/db');

class IO {
  constructor(server){
    //check server validate
    if(!server || ! server instanceof httpServer){
      throw new Error('failed to initial IO server');
    }
    //create database instance
    this.DB = new Database();
    this.DB.connect();

    //create io instance
    this.io = socketIO(server);
  }

  reloadTodos(){
    return this.DB.getAllTodos();
  }
  //action dispatcher, handle events and payload
  actionDispatch(client, {name, payload=''}){
    let ret
    switch(name){
      //delete one by id and let other clients do same thing
      case 'deleteOne':
      ret = this.DB.deleteOneById(payload);
      if(ret){
        client.broadcast.emit('action', {name, payload:payload});
      }
      break;
      
      //delete all
      case 'deleteAll':
        ret = this.DB.deleteAll();
        client.broadcast.emit('action', {name});
        break;

      //toggle completed status for one id
      case 'toggleCompleteOne':
        ret = this.DB.toggleCompletedOneById(payload.id, payload.completed);
        client.broadcast.emit('action', {name, payload:ret});
        break;
      
      //toggle completed status for all clients 
      // payload is completed or not   
      case 'toggleCompleteAll':
        this.DB.toggleCompletedAll(payload);
        client.broadcast.emit('action', {name, payload});
        break;

      //to ask all other client to update the offline client's merged list
      case 'updateWholeList':
        this.DB.updateAllTodos(payload);
        client.broadcast.emit('updateWholeList', payload);
        break;

      // add a new todo
      case 'make':
      ret = this.DB.insertOne(payload.title, payload.id);
      client.broadcast.emit('action', {name:'append', payload:ret});
      break;
      
      // let all other clients know one todo is being edited
      case 'editing':
      client.broadcast.emit('action', {name, payload})
      break;

      // let all other clients know one the editing is done
      case 'editDone':
        this.DB.updateTitleById(payload.id, payload.title)
        client.broadcast.emit('action', {name, payload})
        break;
      default:
        return null
    }
  }

  //broadcast how many user is online
  broadcastUserNums(){
    this.io.clients((err, clients) => {
      if(err) throw err;
      this.io.emit('updateUserNum', clients.length);
    })
  }

  listen(){
    this.io.on('connection', (client) => {
      console.log(`connected ${client.id}`);
      //each new connection will update user numbers
      this.broadcastUserNums()

      //this block is to handle offline situation
      // on intial, first let client know the current list
      client.emit('load', this.DB.getAllTodos())
      
      // client will ack back and let server know if it was offline prev
      client.on('loadAck', ({isOffLinePrev, mergedList} )=> {
        if(isOffLinePrev){
          //if it was offline, then will return server a new list.
          //new list is merged with server list and client's local list.
          //then let all other clients know the merged list and ask them to update
          this.actionDispatch(client, {name:'updateWholeList', payload:mergedList})
        }
        // if it is new online, no need to do any thing
        // sinece on the initial, server has already let client know the server list
        //client will update itself
      })

      //handle all actions and events
      client.on('action', (payload) => {
        this.actionDispatch(client, payload);
      })

      //if a clients disconnected, then let other clients know
      client.on('disconnect', () => {
        console.log('disconnect')
        this.broadcastUserNums()
      })

      
    })

    
  }
};

module.exports.IO = IO
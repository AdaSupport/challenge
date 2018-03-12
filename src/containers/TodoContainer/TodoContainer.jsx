import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList  from '../../components/TodoList';
import TextInput from '../../components/TextInput/TextInput';
import Footer from '../../components/Footer/Footer';
import socketIOClient from 'socket.io-client';
import {ID} from '../../helper/helper'
import * as todoActions from  '../../actions/todos';

const STORAGE = 'REAL_TIME_TODO';

const socket = socketIOClient('http://localhost:3001/');

//set cached data to local storage
const cachedData = (data) => {
  localStorage.setItem(STORAGE, JSON.stringify(data));
}
//get cached data from local storage
const getCachedData = () => {
  return JSON.parse(localStorage.getItem(STORAGE));
}

//remove cached daata
const clearCachedData = () => {
  localStorage.removeItem(STORAGE);
}

//This function is to merge local list and server list when re-connect after offline
// will only add or update the server list based on local one.
// will not delete if local one does not exist
// a simple hash table method: O(n)
const mergeLocalList = (local, remote) => {
  let hash = {};
  remote.forEach((todo) => {
    hash[todo.id] = todo;
  })
  local.forEach((todo) => {
    if(!hash[todo.id]){
      //local added
      hash[todo.id] = todo;
    }else{
      let t = hash[todo.id];
      if(t.title !== todo.title || t.completed !== todo.completed){
        hash[todo.id] = todo
      }
    }
  })

  //convert hash back to array
  return  Object.keys(hash).map((key) => { return hash[key]} )
}


class TodoContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      online: false,
      userNum: 0,
      localList: []
    }
  }

  componentWillMount(){
    //check socket is connected or not
    if(socket.connected){
      this.setState({online:true})
    }
  }
  componentDidMount(){
    //if not connected after mount,
    //will load cached data and show
    if(socket.disconnected){
      const cachedData = getCachedData() || [];
      this.props.loadTodosList(cachedData);
      this.setState({userNum:0, localList:cachedData});
    }


    socket.on('load', (list) => {
      //once connected, clear cache
      clearCachedData()
      // this.setState({online: true});
      if(!this.state.online){
        this.setState({online: true});
        //if prev is not online,
        //need to merge local changes and server data
        // only merge added / toggle completed local changes to server data and update other users
        // Deleted todo might be restored.
        const localList = this.props.todos;
        const mergedList = mergeLocalList(localList, list);
        //ACK to let server know the merged list
        socket.emit('loadAck',{isOffLinePrev: true, mergedList})
        this.props.loadTodosList(mergedList);
      }else{
        //Don't even need let server know!
        this.props.loadTodosList(list);
      }
    });

    //listener for update others merged list
    socket.on('updateWholeList', (list) => {
      this.props.loadTodosList(list);
    })

    //listen for updating users online
    socket.on('updateUserNum', (userNum) => {
      this.setState({userNum})
    })

    //handle all other actions
    socket.on('action', (payload) => {
      this.actionDispatch(payload)
    })

    //handle disconnect
    //once disconnect, means server is down
    //will cached data  
    socket.on('disconnect', () => {
      this.setState({userNum:0, online:false})
      cachedData(this.props.todos)
    })
  }
 

  //action dispatcher to handle action request from server.
  //normally action was taken by other user
  actionDispatch = ({name, payload}) => {
    switch(name){
      case 'append':
        this.props.appendOneTodo(payload);
        break;
      case 'updateWholeList':
        this.props.loadTodosList(payload);
        break;
      case 'deleteOne':
        this.props.deleteOneTodo(payload);
        break;
      case 'deleteAll':
        this.props.deleteAll();
        break;
      case 'toggleCompleteOne':
        this.props.toggleCompletedOneTodo(payload.id, payload.completed);
        break;
      case 'toggleCompleteAll':
        this.props.toggleCompletedAllTodo(payload);
        break;
      case 'editing':
        this.props.updateTitleById({id:payload.id, title:payload.title, isEditing:true});
        break;
      case 'editDone':
        this.props.updateTitleById({id:payload.id, title:payload.title, isEditing:false});
      default:
        return null
    }
  }

  //self callbacks below
  
  //handle user create new todo by enter
  onPressEnter = (text) => {
    const newTodo = {title:text, id:ID(), completed:false, isEditing:false}
    this.props.appendOneTodo(newTodo);
    socket.emit('action', {name:'make', payload:newTodo});
    this.checkStoreCacheData()
  }

  //ask server to ask other clients update the merged list
  updateWholeList = (list) => {
    socket.emit('action', {name:'updateWholeList', payload:list});
    this.checkStoreCacheData()
  }

  //handle user click delete button
  onDelete = (id) => {
    this.props.deleteOneTodo(id);
    socket.emit('action', {name:'deleteOne', payload:id});
    this.checkStoreCacheData()
  }

  //handle user toggle the status of completed  
  onToggleComplete = ({id, completed}) => {
    this.props.toggleCompletedOneTodo(id, completed);    
    socket.emit('action', {name:'toggleCompleteOne', payload:{id, completed}});
    this.checkStoreCacheData()
    
  }

  //handle user toggle the status of all todos
  onToggleCompleteAll = () => {
    const completed = this.props.todos.some((todo) =>{return !todo.completed}) 
    this.props.toggleCompletedAllTodo(completed);
    socket.emit('action', {name:'toggleCompleteAll', payload:completed});
    this.checkStoreCacheData()
    
  }

  //handle user click remove all
  onRemoveAll = () => {
    this.props.deleteAll()
    socket.emit('action', {name:'deleteAll', payload:{}});
    this.checkStoreCacheData()
  }

  //handle user is editing a todo
  onTodoEditing = (title, id) => {
    // we don't want to show editing on local, therefore set isEditing to false
    this.props.updateTitleById({title, id, isEditing:false});    
    socket.emit('action', {name:'editing', payload:{id, title}})
  }
  //handle editing done
  onTodoEditingDone = (title, id) => {
    this.props.updateTitleById({title, id, isEditing:false});    
    socket.emit('action', {name:'editDone', payload:{id, title}})
  }

  //check is online or not when any action is taken
  checkStoreCacheData = () =>{
    //everytime if is not online, will cache todos
    if(!this.state.online) {
      cachedData(this.props.todos)
    }
  }

  //render three parts
  //1. input -- handle user create new todo
  //2. todo list -- handle todo list status
  //3. footer to remove all and show users
  render() {
    const {todos} = this.props
    return (
      <div>
          <TextInput todoList={todos} 
                    onPressEnter={this.onPressEnter} 
                    onToggleCompleteAll={this.onToggleCompleteAll}/>

          <TodoList todoList={todos} 
                    onDelete={this.onDelete}
                    onToggleComplete={this.onToggleComplete}
                    onEditing={this.onTodoEditing}
                    onEditingDone={this.onTodoEditingDone}/>
          <Footer userNum={this.state.userNum} 
                  onRemoveAll={this.onRemoveAll}
                  onUndo={this.onUndo}/>
      </div>
    )
  }
}
function mapStateToProps({todos}) {
  return {
    todos: todos.list,
    stack: todos.stack
  };
}

function mapDispatchToProps(dispatch) {
  const actions = todoActions
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoContainer);
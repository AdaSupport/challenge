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

console.log(socket);

const cachedData = (data) => {
  localStorage.setItem(STORAGE, JSON.stringify(data));
}

const getCachedData = () => {
  return JSON.parse(localStorage.getItem(STORAGE));
}

const clearCachedData = () => {
  localStorage.removeItem(STORAGE);
}

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
      if(t.title !== todo.title || t.completed !== todo.completed || t.isEditing !== todo.isEditing){
        hash[todo.id] = todo
      }
    }
  })
  
  const mergedList = Object.keys(hash).map((key) => { return hash[key]} )
  return mergedList

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
    if(socket.connected){
      this.setState({online:true})
    }
  }
  componentDidMount(){
    console.log('mounted');

    //if not connected after mount,
    //will load cached data
    if(socket.disconnected){
      
      const cachedData = getCachedData() || [];
      this.props.loadTodosList(cachedData);
      this.setState({userNum:0, localList:cachedData})
    }

    socket.on('initial', (list) => {
      //once connected, clear cache
      console.log('clear cache data')
      clearCachedData()
      // this.setState({online: true});
      if(!this.state.online){
        this.setState({online: true});
        //if prev is not online,
        //need to merge local changes and server data
        // Here only merge added / toggle completed local changes to server data and update other users
        // Deleted todo might be restored.
        const localList = this.props.todos;
        const mergedList = mergeLocalList(localList, list);
        list = mergedList
        // this.updateWholeList(mergedList)
        socket.emit('initialAck',{isOffLinePrev: true, mergedList})
        this.props.loadTodosList(mergedList);
      }else{
        this.props.loadTodosList(list);
      }
    });

    socket.on('updateWholeList', (list) => {
      this.props.loadTodosList(list);
    })


    socket.on('updateUserNum', (userNum) => {
      this.setState({userNum})
    })

    socket.on('action', (payload) => {
      this.actionDispatch(payload)
    })

    socket.on('disconnect', () => {
      this.setState({userNum:0, online:false})
      //once disconnected, will cache
      cachedData(this.props.todos)
    })
  }
 


  actionDispatch = ({name, payload}) => {
    console.log(name, payload)
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
      default:
        return null
    }
  }

  onPressEnter = (text) => {
    const newTodo = {title:text, id:ID(), completed:false, isEditing:false}
    console.log(newTodo)
    this.props.appendOneTodo(newTodo);
    socket.emit('action', {name:'make', payload:newTodo});
    this.checkStoreCacheData()
  }

  updateWholeList = (list) => {
    socket.emit('action', {name:'updateWholeList', payload:list});
    this.checkStoreCacheData()
  }

  onDelete = (id) => {
    this.props.deleteOneTodo(id);
    socket.emit('action', {name:'deleteOne', payload:id});
    this.checkStoreCacheData()
  }
  onToggleComplete = ({id, completed}) => {
    this.props.toggleCompletedOneTodo(id, completed);    
    socket.emit('action', {name:'toggleCompleteOne', payload:{id, completed}});
    this.checkStoreCacheData()
    
  }

  onToggleCompleteAll = () => {
    const completed = this.props.todos.some((todo) =>{return !todo.completed}) 
    this.props.toggleCompletedAllTodo(completed);
    socket.emit('action', {name:'toggleCompleteAll', payload:completed});
    this.checkStoreCacheData()
    
  }

  onRemoveAll = () => {
    this.props.deleteAll()
    socket.emit('action', {name:'deleteAll', payload:{}});
    this.checkStoreCacheData()
  }

  
  checkStoreCacheData = () =>{
    //everytime if is not online, will cache todos
    if(!this.state.online) {
      console.log('will store')
      cachedData(this.props.todos)
    }
  }

  render() {
    const {todos} = this.props
    return (
      <div>
          <TextInput todoList={todos} 
                    onPressEnter={this.onPressEnter} 
                    onToggleCompleteAll={this.onToggleCompleteAll}/>

          <TodoList todoList={todos} 
                    onDelete={this.onDelete}
                    onToggleComplete={this.onToggleComplete}/>
          <Footer userNum={this.state.userNum}onRemoveAll={this.onRemoveAll}/>
      </div>
    )
  }
}
function mapStateToProps({todos}) {
  return {
    todos: todos.list
  };
}

function mapDispatchToProps(dispatch) {
  const actions = todoActions
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoContainer);
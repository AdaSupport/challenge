import React, { Component } from 'react';
import Todo from './todo.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {showTodos} from "../redux/actions/todoActions";
import axios from 'axios';



class AllTodos extends Component {

  constructor(props) {
    super(props);
    this.state = {allTodos: null}
  }

  componentDidMount(){
    let todosArray
    let self = this
    // create divs using localStorage to use in case user goes offline
    if(localStorage.getItem('allTodos') !== "null") {
      let offlineTodos = JSON.parse(localStorage.getItem('allTodos'))
      let offlineTodosDivs = offlineTodos.map((todo)=>{
        let todoDiv =
          <div>
            <Todo completed={self.props.completed} todo={todo.title}/>
          </div>
        return todoDiv
      })
      this.setState({offlineTodos: offlineTodosDivs})
    }
    axios.get("http://localhost:4000/allTodos")
      .then(function(res, rej){
       todosArray = res.data
      //  console.log(res.data)
       self.props.action(showTodos(todosArray))
     })
      .then(function(){
        self.setState({ todos: self.props.todos.todos})
      })
        .then(function(){
          let initialTodos = JSON.parse(localStorage.getItem('allTodos'))
          if(initialTodos === null){
            initialTodos = self.state.todos
          }
          // let initialTodos = self.state.todos
          let allTodos = initialTodos.map((todo)=>{
            let todoDiv =
              <div>
                <Todo completed={self.props.completed} todo={todo.title}/>
              </div>
            return todoDiv
          })
          self.setState({allTodos: allTodos})
        })
  }
  componentDidUpdate(){
    let self = this
    // create localStorage to use if there is no connection and if it was not already created
    if(localStorage.getItem('allTodos') !== this.state.allTodos) {
      localStorage.setItem('allTodos', JSON.stringify(this.props.todos.todos))
    }
    // if todo is added new div is pushed to the list of todos
    if(this.state.allTodos && this.state.allTodos.length < this.props.todos.todos.length){
      let todos = this.state.todos
      let todo = todos[todos.length - 1]
      let oldTodos = this.state.allTodos
      let todoDiv =
        <div>
          <Todo completed={self.props.completed} todo={todo.title}/>
        </div>
      oldTodos.push(todoDiv)
      this.setState({allTodos: oldTodos})
    } else if (this.state.allTodos && this.state.allTodos.length > this.props.todos.todos.length) {
      // if todo is deleted then it is removed from the list and is rerendered
      let newTodos = JSON.parse(localStorage.getItem('allTodos'))
      // let newTodos = this.props.todos.todos
      let allTodos = newTodos.map((todo)=>{
        let todoDiv =
          <div>
            <Todo completed={self.props.completed} todo={todo.title}/>
          </div>
        return todoDiv
      })
      self.setState({allTodos: allTodos})
    }
  }

  render() {
    // use offline divs if user is offline
    var input = navigator.onLine ? this.state.allTodos : this.state.offlineTodos;
    return (
      <div>
        <ul>
          <li>
            {input}
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, prop) {
  return {
    todos: state.todos.todos
  }
}
function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(showTodos, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllTodos)

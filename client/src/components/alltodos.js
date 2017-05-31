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
          let initialTodos = self.state.todos
          let allTodos = initialTodos.map((todo)=>{
            let todoDiv =
              <div>
                <Todo todo={todo.title}/>
              </div>
            return todoDiv
          })
          self.setState({allTodos: allTodos})
        })
  }
  componentDidUpdate(){
    let self = this
    // debugger
    // if todo is added new div is pushed to the list of todos
    if(this.state.allTodos && this.state.allTodos.length < this.props.todos.todos.length){
      let todos = this.state.todos
      let newTodo = todos[todos.length - 1]
      let oldTodos = this.state.allTodos
      let todoDiv =
        <div>
          <Todo todo={newTodo.title}/>
        </div>
      oldTodos.push(todoDiv)
      this.setState({allTodos: oldTodos})
    } else if (this.state.allTodos && this.state.allTodos.length > this.props.todos.todos.length) {
      let newTodos = this.props.todos.todos
      let allTodos = newTodos.map((todo)=>{
        // debugger
        let todoDiv =
          <div>
            <Todo todo={todo.title}/>
          </div>
        return todoDiv
      })
      self.setState({allTodos: allTodos})
    }
  }

  render() {
    return (
      <div className="todos-div">
        <ul>
          <li>
            {this.state.allTodos}
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

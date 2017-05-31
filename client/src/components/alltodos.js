import React, { Component } from 'react';
import Todo from './todo.js'
import Todos from '../state/todos'
import getTodosAsync from '../state/todos'
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

  render() {
    // let allTodos
    // console.log(this.props)
    // if(this.state.todos){
    //
    // }
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

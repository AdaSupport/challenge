import React, { Component } from 'react';
import './App.css';
import AllTodos from './components/alltodos.js'
import AddTodo from './components/addtodo.js'
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {removeAll} from "./redux/actions/todoActions";
var Confirm = require('react-confirm-bootstrap');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { allCompleted: false, deleted: false, completedOrNot: "notCompleted", allDeleteClicked: false}
    this.handleCompleteAllClick = this.handleCompleteAllClick.bind(this);
    this.handleDeleteAllClick = this.handleDeleteAllClick.bind(this);
  }

  handleCompleteAllClick(){
    if(this.state.allCompleted){
      this.setState({
        completedOrNot: "notCompleted",
        allCompleted: !this.state.allCompleted
      })
    } else {
      this.setState({
        completedOrNot: 'Completed',
        allCompleted: !this.state.allCompleted
      })
    }
  }

  handleDeleteAllClick(){
    axios.post("http://localhost:4000/removeAll")
    this.props.action(removeAll())
    this.setState({
      allDeleteClicked: !this.state.allDeleteClicked 
    })
  }

  render() {
    let completedButtonStyle = "inverse"
    let todoStyle
    if(this.state.allCompleted){
      completedButtonStyle = "primary"
      todoStyle = {
        "backgroundColor": "lightgrey",
        "opacity": "0.3"
      }
    }
    let deleteTodos =
      <Confirm
          onConfirm={this.handleDeleteAllClick}
          body="Are you sure you want to delete all tasks!?"
          confirmText="Confirm Delete All"
          title="Deleting Stuff">
          <Button className="buttonToRuleThemAll" bsSize="sm" bsStyle="danger" type="button"><span className="glyphicon glyphicon-remove todo-button"></span></Button>
      </Confirm>
    return (
      <div className="App">
        <div className="container main-div">
          <h2> Todo app</h2>
          <AddTodo />
          <br/>
          <div className="todos-div" style={todoStyle}>
            <AllTodos/>
          </div>
          <Button className="buttonToRuleThemAll" onClick={this.handleCompleteAllClick} bsSize="sm" bsStyle={completedButtonStyle} type="button"><span className="glyphicon glyphicon-ok todo-button"></span></Button>
          {deleteTodos}
        </div>
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
    action: bindActionCreators(removeAll, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

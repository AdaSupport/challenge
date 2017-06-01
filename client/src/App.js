import React, { Component } from 'react';
import './App.css';
import AllTodos from './components/alltodos.js'
import AddTodo from './components/addtodo.js'
import Button from 'react-bootstrap/lib/Button';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { allCompleted: false, deleted: false, completedOrNot: "notCompleted"}
    this.handleCompleteAllClick = this.handleCompleteAllClick.bind(this);
    this.handledeleteAllClick = this.handledeleteAllClick.bind(this);
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

  handledeleteAllClick(){
    // let todo = {title: this.props.todo}
    // axios.post("http://localhost:4000/remove", todo)
    // this.props.action(removeTodo(this.props.todo))
  }

  render() {
    let completedButtonStyle = "inverse"
    let todoStyle
    if(this.state.allCompleted){
      completedButtonStyle = "primary"
      todoStyle = {
        "background-color": "lightgrey",
        "opacity": "0.3"
      }
    }
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
          <Button className="buttonToRuleThemAll" onClick={this.handledeleteAllClick} bsSize="sm" bsStyle="danger" type="button"><span className="glyphicon glyphicon-remove todo-button"></span></Button>
        </div>
      </div>
    );
  }
}

export default App;

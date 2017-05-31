import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';


class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { completed: false};
    this.handleCompleteClick = this.handleCompleteClick.bind(this);
  }

  handleCompleteClick(){
    this.setState({
      completed: !this.state.completed
    });
  }
  render() {
    let completedStyle = "inverse"
    if(this.state.completed){
      completedStyle = "primary"
    }
    return (
      <div className="todo-div">
        <p className="todo">finish challenge</p>
        <div className="buttons">
          <Button onClick={this.handleCompleteClick} bsSize="xs" bsStyle={completedStyle} type="button"><span className="glyphicon glyphicon-ok todo-button"></span></Button>
          <Button bsSize="xs" bsStyle="danger" type="button"><span className="glyphicon glyphicon-remove todo-button"></span></Button>
        </div>
      </div>
    );
  }
}

export default Todo;

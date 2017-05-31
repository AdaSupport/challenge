import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';


class Todo extends Component {
  render() {
    return (
      <div className="todo-div">
        <p className="todo">finish challenge</p>
        <div className="buttons">
          <Button bsSize="xs" bsStyle="" type="button"><span className="glyphicon glyphicon-ok todo-button"></span></Button>
          <Button bsSize="xs" bsStyle="danger" type="button"><span className="glyphicon glyphicon-remove todo-button"></span></Button>
        </div>
      </div>
    );
  }
}

export default Todo;

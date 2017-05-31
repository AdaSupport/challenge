import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';



class AddTodo extends Component {
  render() {
    return (
      <div className="add-todo-div">
        <div className="form">
          <div className="input-group">
            <input type="text" className="form-control"/>
            <span className="input-group-btn">
              <Button bsStyle="primary" type="button">
                <span>Add Task</span>
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default AddTodo;

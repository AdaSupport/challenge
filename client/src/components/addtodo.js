import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import TodosState from '../state/todos'
import { connect } from 'react-redux'
import axios from 'axios';


class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = { title: ""};
    this.handleAddPost = this.handleAddPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleAddPost(e){
    var title = this.state.title
    debugger
    axios.post("http://localhost:4000/newTodo", title)
  }

  handleChange(e){
    this.setState({
      title: e.target.value
    })
  }

  componentDidMount(){
    debugger
    TodosState.getTodos()
  }

  render() {
    return (
      <div className="add-todo-div">
        <div className="form">
          <div className="input-group">
            <input type="text" className="form-control"/>
            <span className="input-group-btn">
              <Button onClick={ this.handleAddPost } bsStyle="primary" type="button">
                <span onChange={ this.handleChange} >Add Task</span>
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    todos: state.todo
  }
})(AddTodo);

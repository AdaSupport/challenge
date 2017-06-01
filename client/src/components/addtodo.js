import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux'
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {addTodo} from "../redux/actions/todoActions";


class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = { title: ""};
    this.handleAddPost = this.handleAddPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleAddPost(e){
    var title = {title: this.state.title}
    axios.post("http://localhost:4000/newTodo", title)
    this.props.action(addTodo(title))
  }

  handleChange(e){
    this.setState({
      title: e.target.value
    })
  }


  render() {
    return (
      <div className="add-todo-div">
        <div className="form">
          <div className="input-group">
            <input onChange={ this.handleChange} type="text" className="form-control"/>
            <span className="input-group-btn">
              <Button onClick={ this.handleAddPost } bsStyle="primary" type="button">
                <span >Add Task</span>
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state, prop) {
  return {
    todo: state.todo,
    todos: state.todos
  }
}
function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(addTodo, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo)

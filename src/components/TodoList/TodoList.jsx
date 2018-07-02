import React, { Component } from 'react'
import { Container, Segment } from 'semantic-ui-react'
import Todo from '../Todo'

export default class TodoList extends Component {
  renderTodoList(list){
    if(!list || list.length < 1){return [];}

    return list.map((todo, idx) =>{
      return (<Todo key={todo.id} {...todo} 
                    onDelete={this.props.onDelete}
                    onToggleComplete={this.props.onToggleComplete}
                    onEditing={this.props.onEditing}
                    onEditingDone={this.props.onEditingDone}/>);
    })
  }

  //not much logic this component
  //mainly to pass callback and status from todo container to todo item
  render() {
    return (
      <div>
        <Container>
          <Segment.Group raised>
            {this.renderTodoList(this.props.todoList)}
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

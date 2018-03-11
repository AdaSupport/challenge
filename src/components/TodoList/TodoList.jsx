import React, { Component } from 'react'
import { Container, Segment } from 'semantic-ui-react'
import Todo from '../Todo'

export default class TodoList extends Component {
  renderTodoList(list){
    if(!list || list.length < 1){return [];}

    return list.map((todo, idx) =>{
      return (<Todo key={todo.id} {...todo} 
                    onDelete={this.props.onDelete}
                    onToggleComplete={this.props.onToggleComplete}/>);
    })
  }

  render() {
    const { todoList } = this.props
    return (
      <div>
        <Container>
          <Segment.Group >
            {this.renderTodoList(todoList)}
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

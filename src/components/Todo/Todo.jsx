import React, { Component, Fragment } from 'react'
import { Segment, Icon } from 'semantic-ui-react'


const TodoText = ({text,completed}) => {
  if(completed){
    return (<del style={{color:'grey',fontStyle: 'italic'}} >{text}</del>)
  }
  return (<span>{text}</span>)
}

const RightHandBtn = (props) => {
  return (
    <Icon name={props.type} color={props.color} style={{float:'right'}} onClick={props.clickAction}/>
  )
}
const DeleteBtn = (props) => {
  return (
    <RightHandBtn type='remove' color='red' clickAction={props.onDelete}/>
  )
}

const CompletedBtn = (props) => {
  let color = 'grey',
      name  = 'square outline'
  if(props.completed){
    color = 'green'
    name  = 'check'
  }
  return (
    <Icon name={name} color={color} onClick={props.onClick} />
  )
}



export default class Todo extends Component {
  constructor(props){
    super(props);
    this.state = {
      showButton: false,
      completed: this.props.completed
    }
  }

  componentWillReceiveProps({completed}){
    if(completed !== this.state.completed){
      this.setState({completed});
    }
  }

  onMouseEnter = () => {
    if(!this.state.showButton){
      this.setState({showButton:true});
    }
  }
  onMouseLeave = () => {
    if(this.state.showButton){
      this.setState({showButton:false});
    }
  }

  onToggleComplete = (id) => {
    const completed = !this.state.completed
    this.setState({completed});
    this.props.onToggleComplete({id, completed});
  }
  
  render() {
    const {title, id} = this.props
    const completed = this.state.completed;
    if (title){
      return (
        <div >
          <Segment onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <CompletedBtn completed={completed} onClick={()=>{this.onToggleComplete(id)}}/>
            <TodoText text={title} completed={completed}/>
            {
              this.state.showButton &&
              (
                <Fragment>
                  <DeleteBtn onDelete={()=>this.props.onDelete(id)}/>
                </Fragment>
              )
            }
          </Segment>
        </div>
      )
    }
    return null

  }
}

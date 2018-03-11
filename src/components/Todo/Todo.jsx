import React, { Component, Fragment } from 'react'
import { Segment, Icon } from 'semantic-ui-react'


const TodoText = ({text}) => {
  return (<span>{text}</span>)
}

const RightHandBtn = (props) => {
  return (
    <Icon name={props.type} color={props.color}style={{float:'right'}} onClick={props.clickAction}/>
  )
}
const DeleteBtn = (props) => {
  return (
    <RightHandBtn type='remove' color='red' clickAction={props.onDelete}/>
  )
}



export default class Todo extends Component {
  constructor(props){
    super(props);
    this.state = {
      showButton: false
    }
  }

  onMouseEnter = () => {
    if(!this.state.showButton){
      this.setState({showButton:true})
    }
  }
  onMouseLeave = () => {
    if(this.state.showButton){
      this.setState({showButton:false})
    }
  }
  
  render() {
    const {title, id, completed} = this.props
    if (title){
      return (
        <div >
          <Segment onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <TodoText text={title}/>
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

import React, { Component, Fragment } from 'react'
import { Segment, Icon, Input, List } from 'semantic-ui-react'


const TodoText = ({text,completed, isEditing}) => {
  let style = {};
  if(isEditing || completed){
    style={color:'grey',fontStyle: 'italic'}
  }
  if(completed){
    return (<del style={style}>{text}</del>)
  }
    return (<span style={style}>{text}</span>)
}

//gen delete btn for todo
const DeleteBtn = (props) => {
  return (
    <Icon link name='remove' color='red' style={{float:'right'}} onClick={props.onDelete}/>
  )
}

//gen edit btn for todo
const EditBtn = (props) => {
  return (
    <Icon link name='write' color='grey' onClick={props.onClick}/>
  )
}

//show complete btn based on status and being edited
const CompletedBtn = (props) => {
  let color = 'grey',
      name  = 'square outline'
  if(props.completed){
    color = 'green'
    name  = 'check'
  }
  return (
    <Icon link={!props.isEditing} name={name} color={color} onClick={!props.isEditing && props.onClick}/>
  )

}



export default class Todo extends Component {
  constructor(props){
    super(props);
    this.state = {
      showButton: false,
      completed: this.props.completed,
      value: this.props.title,
      editing:false
    }
  }

  componentWillReceiveProps({completed}){
    if(completed !== this.state.completed){
      this.setState({completed});
    }
  }

  //simulate hover
  onMouseEnter = () => {
    if(!this.state.showButton){
      this.setState({showButton:true});
    }
  }

  //simulate hover  
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

  //based on current status
  //to show edit or not
  //once click edit button
  //will conside as editing  
  onClickEdit = () => {
    const {value, editing} = this.state;
    if(editing){
      this.props.onEditingDone(value, this.props.id);
    }else{
      this.props.onEditing(value, this.props.id);
    }
    if(value){
      this.setState({editing:!editing})
    }
  }

  //show editing
  onEditing = (e) => {
    const value = e.target.value;
    this.setState({value})
    this.props.onEditing(value, this.props.id)
  }


  //when press enter means edit is done
  onKeyUp = (e) => {
    if(e.keyCode === 13 && this.state.value && this.state.editing){
      this.setState({editing: false});
      this.props.onEditingDone(this.state.value, this.props.id);
    }
  }
  
  render() {
    const {title, id, isEditing} = this.props
    const completed = this.state.completed;
    console.log(isEditing)
      return (
          <Segment onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            
            <CompletedBtn isEditing={isEditing} completed={completed} onClick={()=>{this.onToggleComplete(id)}}/>
            {
              !this.state.editing ?
              <TodoText text={title} completed={completed} isEditing={isEditing}/> 
              :
              <Input maxLength={64}  
                    style={{ width:"70%" }} 
                    focus 
                    value={this.state.value} 
                    onKeyUp={this.onKeyUp} 
                    onChange={this.onEditing}/>
            }
            {
              isEditing ? 
              <List horizontal floated='right' style={{color:"grey"}} >
                <List.Item>Some one is editing...</List.Item>
              </List>
              :
              (this.state.showButton &&
                (
                  <Fragment>
                    <EditBtn onClick={this.onClickEdit}/>                              
                    <DeleteBtn onDelete={()=>this.props.onDelete(id)}/>
                  </Fragment>
                )
              )
            }
          </Segment>
      )

  }
}

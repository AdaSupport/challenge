import React, { Component } from 'react'
import { Input, Container, Icon } from 'semantic-ui-react'

export default class TextInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      allCompleted: false
    }
    this.onChange.bind(this)
  }

  //check if every todo is completed
  //then switch icon
  componentWillReceiveProps({todoList}){
    if(todoList && todoList.length > 0){
      const willAllCompleted = !todoList.some((todo) => {return todo.completed !== true})
      if(willAllCompleted !== this.state.allCompleted){
        this.setState({allCompleted:willAllCompleted});
      }
    }
  }

  //hadnle enter
  onKeyUp = (e) => {
    if(e.keyCode === 13 && this.state.value){
      this.props.onPressEnter(this.state.value);
      this.setState({value: ''});
    }
  }
  onChange = (e) =>{
    this.setState({value: e.target.value.trim()})
  }

  //change icon based on status
  toggleBtn = () => {
    let name = 'checked calendar'
    if(this.state.allCompleted) {
      name = 'calendar outline'
    } 
    return <Icon  link name={name} placeholder='placeHolder' onClick={this.props.onToggleCompleteAll}/>
  }
  render() {
    const {value} = this.state
    return (
      <Container>
        <Input iconPosition='left' icon={this.toggleBtn()}
        
        value={value} 
        maxLength={64} 
        fluid placeholder='What to do next...' 
        onKeyUp={this.onKeyUp}
        onChange={this.onChange}/>
      </Container>
    )
  }
}

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
  componentWillReceiveProps({todoList}){
    const willAllCompleted = !todoList.some((todo) => {return todo.completed !== true})
    if(willAllCompleted !== this.state.allCompleted){
      this.setState({allCompleted:willAllCompleted});
    }
  }
  onKeyUp = (e) => {
    if(e.keyCode === 13 && this.state.value){
      this.props.onPressEnter(this.state.value);
      this.setState({value: ''});
    }
  }
  onChange = (e) =>{
    this.setState({value: e.target.value})
  }

  toglleBtn = () => {
    let name = 'checked calendar'
    if(this.state.allCompleted) {
      name = 'calendar outline'
    } 
    return <Icon  link name={name} placeholder='123' onClick={this.props.onToggleCompleteAll}/>
  }
  render() {
    const {value} = this.state
    return (
      <Container>
        <Input iconPosition='left' icon={this.toglleBtn()}
        
        value={value} 
        maxLength={64} 
        fluid placeholder='What to do next...' 
        onKeyUp={this.onKeyUp}
        onChange={this.onChange}/>
      </Container>
    )
  }
}

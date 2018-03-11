import React, { Component } from 'react'
import { Input, Container } from 'semantic-ui-react'

export default class TextArea extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: ''
    }
    this.onChange.bind(this)
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
  render() {
    const {value} = this.state
    return (
      <Container>

        <Input value={value} fluid placeholder='What to do next...' 
        onKeyUp={this.onKeyUp}
        onChange={this.onChange}/>
      </Container>
    )
  }
}

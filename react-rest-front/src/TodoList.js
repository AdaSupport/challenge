import React, { Component } from 'react';
import Todo from './Todo';

const todos = 
    [{
        "title" : "Order more coffee from Pilot"
    },
    {
        "title" : "Clean the coffee machine"
    },
    {
        "title" : "Sweep the floor"
    },
    {
        "title" : "Order a new display for Gordon"
    },
    {
        "title" : "Fix the charger for the speaker"
    },
    {
        "title" : "Finish making the hiring challenge"
    }]

class TodoList extends Component {
  constructor() {
    super();

    this.state =    {
                        todos: todos,
                        tempItem: ''
                    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  handleChange(e) {
    this.setState({
        tempItem: e.target.value
    });
  }

  handleAddItem(e) {
    e.preventDefault();
    let todos = this.state.todos;
    todos.push({title: this.state.tempItem});
    this.setState({todos: todos, tempItem: ''})
  }
  
  render() {
    let todos = this.state.todos;
    let todosJSX = [];

    todos.map((todo, i) => {
      return todosJSX.push(<Todo todo={todo} key={i} />);
    })
    return(
      <div>
        <form onSubmit={this.handleAddItem}>
            <input id="todo-input" value={this.state.tempItem} type="text" onChange={this.handleChange} placeholder="Feed the cat" />
            <input type="submit" value="make" />
        </form>
            <ul>
                {todosJSX}
            </ul>
      </div>
    )
  }
    
}

export default TodoList;
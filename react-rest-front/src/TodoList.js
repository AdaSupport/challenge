import React, { Component } from 'react';
import Todo from './Todo';

const todos = 
    [{
        "title" : "Order more coffee from Pilot", done: false
    },
    {
        "title" : "Clean the coffee machine", done: false
    },
    {
        "title" : "Sweep the floor", done: false
    },
    {
        "title" : "Order a new display for Gordon", done: false
    },
    {
        "title" : "Fix the charger for the speaker", done: false
    },
    {
        "title" : "Finish making the hiring challenge", done: false
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
    this.handleItemCheck = this.handleItemCheck.bind(this);
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

  handleItemCheck(item){
    let todos = this.state.todos;
    
    // Need to use ids generated from a database to be more robust
    todos.map((todo) => {
        if(todo.title === item.title) {
            todo.done = !item.done;
            return todo;
        } else {
            return todo;
        }
    })

    this.setState({todos: todos})
  }
  
  render() {
    let todos = this.state.todos;
    let todosJSX = [];

    todos.map((todo, i) => {
      return todosJSX.push(<Todo todo={todo} key={i} handleItemCheck={this.handleItemCheck}/>);
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
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
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
    this.handleCompleteAll = this.handleCompleteAll.bind(this);
  }

  handleChange(e) {
    this.setState({
        tempItem: e.target.value
    });
  }

  handleAddItem(e) {
    e.preventDefault();
    let todos = this.state.todos.slice();
    todos.push({title: this.state.tempItem});
    this.setState({todos: todos, tempItem: ''})
  }

  handleItemCheck(item){
    let todos = this.state.todos.slice();
    
    // Would ideally use ids generated from a database, instead of title
    todos.map((todo) => {
        if(todo.title === item.title) {
            todo.done = !item.done;
            return todo;
        } else {
            return todo;
        }
    })

    this.setState({todos: todos});
  }

  handleItemDelete(item) {
      let todos = this.state.todos.slice();

      let filteredTodos = todos.filter(todo => {return todo.title !== item.title})
      this.setState({todos: filteredTodos});
  }

  handleDeleteAll() {
    this.setState({todos: []});
  }

  handleCompleteAll() {
    let todos = this.state.todos.slice();

    todos.map((todo) => {
        todo.done = true;
        return todo;
    })
    
    this.setState({todos: todos});
  }
  
  render() {
    let todos = this.state.todos.slice();
    let todosJSX = [];

    todos.map((todo, i) => {
      return todosJSX.push(<Todo    todo={todo}
                                    key={i}
                                    handleItemCheck={this.handleItemCheck}
                                    handleItemDelete={this.handleItemDelete}/>);
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
        <button onClick={this.handleDeleteAll}>Delete all</button>
        <button onClick={this.handleCompleteAll}>Complete all</button>
      </div>
    )
  }

}

export default TodoList;
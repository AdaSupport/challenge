import React, { Component } from 'react';
import Todo from './Todo';
import './TodoList.css';

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
    let localTodos = this.getLocalData('todos');
    let tempItem = this.getLocalData('tempItem');

    if (!localTodos || localTodos.length === 0) {
        this.state =    {
                            todos: todos,
                            tempItem: ''
                        };
    } else {
        this.state =    {
                            todos: localTodos,
                            tempItem: tempItem
                        }
    }

    this.getLocalData = this.getLocalData.bind(this);
    this.setLocalData = this.setLocalData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleItemCheck = this.handleItemCheck.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
    this.handleCompleteAll = this.handleCompleteAll.bind(this);
  }

  getLocalData(name) {
      let  JSONName = JSON.stringify(name);
      let data = JSON.parse(localStorage.getItem(JSONName));
      return data;
  }

  setLocalData(name, data) {
      let JSONName = JSON.stringify(name);
      let JSONData = JSON.stringify(data);
      localStorage.setItem(JSONName, JSONData);
  }

  handleChange(e) {
    this.setLocalData('tempItem', e.target.value);
    this.setState({
        tempItem: e.target.value
    });
  }

  handleAddItem(e) {
    e.preventDefault();
    let todos = this.state.todos.slice();
    todos.push({title: this.state.tempItem});
    this.setLocalData('todos', todos);
    this.setLocalData('tempItem', '');
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
    this.setLocalData('todos', todos);
    this.setState({todos: todos});
  }

  handleItemDelete(item) {
      let todos = this.state.todos.slice();

      let filteredTodos = todos.filter(todo => {return todo.title !== item.title});
      this.setLocalData('todos', filteredTodos);
      this.setState({todos: filteredTodos});
  }

  handleDeleteAll() {
    this.setLocalData('todos', []);
    this.setState({todos: []});
  }

  handleCompleteAll() {
    let todos = this.state.todos.slice();

    todos.map((todo) => {
        todo.done = true;
        return todo;
    })
    this.setLocalData('todos', todos)
    this.setState({todos: todos});
  }
  
  render() {
    let todos = this.state.todos.slice();
    let todosJSX = [];
    todos.map((todo, i) => {
        return todosJSX.push(<Todo  todo={todo}
                                    key={i}
                                    handleItemCheck={this.handleItemCheck}
                                    handleItemDelete={this.handleItemDelete}/>);
        })
    return (
      <div >
        <form className="text-center" onSubmit={this.handleAddItem}>
            <input id="todo-input" value={this.state.tempItem} type="text" onChange={this.handleChange} placeholder="Feed the cat..." />
            <input className="btn btn-sm btn-success" style={{marginLeft: '2%'}} type="submit" value="make" />
        </form>
            <ul>
                {todosJSX}
            </ul>
            <button className="btn btn-danger btn-block btn_width-md"
                    onClick={this.handleDeleteAll}
                    >
                    delete all
            </button>
            <button className="btn btn-success btn-block btn_width-md"
                    onClick={this.handleCompleteAll}
                    >
                    complete all
            </button>
      </div>
    )
  }

}

export default TodoList;
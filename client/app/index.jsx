import React from 'react';
import {render} from 'react-dom';

const server = io('http://localhost:3003/');

const Cache = require('./cach').cach;
const cache = new Cache();

const Title = () => {
  return (
      <h2> ToDo list </h2>
  );
};

class TodoForm extends React.Component {

  // Handles key press events on input
  onKeyPress (event) {
    if(event.key == 'Enter') {
      this.addItem(event.target.value);
      event.target.value = '';
    }
  };

  // Adds a new todo from the input
  addItem (todoTitle) {
    if (todoTitle == "") return;

    server.emit('createTodo', {
      title : todoTitle
    });
  };

  // Removes all todo items
  removeAll () {
    server.emit('removeAll');
  };

  // Checks all todo items
  checkAll () {
    server.emit('checkAll');
  };

  render() {
    return (
      <div id='todo-header'>
        <input id='todo-input' type='text' placeholder='Feed the cat' onKeyPress={this.onKeyPress.bind(this)} autoFocus />
        <div className='text-right'>
          <button type='button' className='todo-list-actions' onClick={this.removeAll}> Remove all </button>
          <button type='button' className='todo-list-actions' onClick={this.checkAll}> Check all </button>
        </div>
      </div>
    );
  };
};

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todo: props.todo
    }
  }

  // Checks selected todo item
  checkItem() {
    server.emit('checkTodo', this.state.todo._id);
  }

  // Removes selected todo item
  removeItem() {
    server.emit('removeTodo', this.state.todo._id);
  }

  render() {
    return (
      <li id={this.state.todo._id} className={this.state.todo.isChecked ? 'todo-checked' : 'todo-unchecked'}
          onClick={this.checkItem.bind(this)}>
        {this.state.todo.title}
        <span className='todo-remove' onClick={this.removeItem.bind(this)}>×</span>
      </li>
    );
  }
}

const TodoList = ({todos}) => {
  const todoItems = todos.map( (todo) => {
    return (<TodoItem todo={todo} key={todo._id} />);
  });

  return (
    <ul id="todo-list"> {todoItems} </ul>
  );
};

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      isFirstConnection: true
    }; 
  }

  // NOTE: Adds listeners for events from the server
  componentDidMount() {

    // This event is for loading the entire list of todos from the server
    server.on('load', (todos) => {
      this.state.todoList = todos;
      this.setState({ todoList : this.state.todoList });
      cache.setItems(this.state.todoList);
    });

    // This event is to report that connection was lost
    server.on('connect_error', () => {
      if (this.state.isFirstConnection) {
        this.setState({ todoList : cache.get() });
        this.state.isFirstConnection = false;
      }
    });

    // This event is for the addition of new Todo item to the list
    server.on('prepend', (todo) => {
      this.state.todoList.unshift(todo);
      this.setState({ todoList : this.state.todoList });
      cache.addItem(todo);
    });

    // This event removes todo by id
    server.on('remove', (id) => {
      var tmpList = this.state.todoList.filter( (todo) => {
        return (todo._id != id);
      } );
      this.setState({ todoList : tmpList });
      cache.removeItem(id);
    });

    // This event removes all todo items
    server.on('removeAll', () => {
      this.setState({ todoList : [] });
      cache.clear();
    });

    // This event checks todo by id
    server.on('check', (id) => {
      this.state.todoList.map( (todo) => {
        if (todo._id == id)
          todo.isChecked = !(todo.isChecked);
      });

      this.setState({ todoList : this.state.todoList });
      cache.checkItem(id);
    });

    // This event checks all todo items
    server.on('checkAll', () => {
      this.state.todoList.map( (todo) => { todo.isChecked = true; } );
      this.setState({ todoList : this.state.todoList });
      cache.checkAll();
    });
  }

  render() {
    return (
      <div id='todo-block'>
        <Title />
        <TodoForm />
        <TodoList todos={this.state.todoList}/>
      </div>
    );
  }
};

render(<TodoApp />, document.getElementById('root'));
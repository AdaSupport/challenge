import React from 'react';
import {render} from 'react-dom';
require("./client.scss");

const server = io('http://localhost:3003/');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text : "",
      todos : [],
      tempTodos : []
    };
  }

  componentDidMount () {
    // Set up scoket listeners on componentDidMount

    server.on('post', todo => {
      const newTempTodos = this.state.tempTodos;

      //Remove tempTodo from cache when it has been successfully added to DB
      // NOTE: This is a bit of a hack since the tempTodos do not have ids in this project. 
      // The better solution would be to create a 'model' (with id) for the todo on the frontend first, then update the frontend store when the post has been successful (ie. exactly how most modern FE frameworks work).
      newTempTodos.shift();

      this.setState({
        todos: this.state.todos.concat([todo]),
        tempTodos: newTempTodos
      });
    });

    server.on('delete', todoId => {
      //this.state.todos is immutable, therefore need to create newArray and setState equal to that
      const newArray = this.state.todos.filter(function(t) {
        return t.id !== todoId;
      });

      this.setState({todos: newArray});
    });

    server.on('update', todo => {
      let 
        update = require('react-addons-update'),
        todos = this.state.todos;

      let todoIndex = todos.findIndex(function(t) { 
        return t.id === todo.id; 
      });

      let updatedTodo = update(todos[todoIndex], {isCompleted: {$set: todo.isCompleted}}); 

      let newTodos = update(todos, {
        $splice: [[todoIndex, 1, updatedTodo]]
      });

      this.setState({todos: newTodos});
    });

    server.on('load', todos => {
      this.setState({todos: todos});
    });
  }

  handleSubmit (e) {
    e.preventDefault();

    let text = this.state.text.trim();

    // On 'make', the FE sends the text value. As mentioned earlier, a more robust solution would be to generate a model (with id) for the todo, and send that instead. I haven't done this here to save time.
    server.emit('make', {
      title : text
    });

    this.setState({
      text: '',
      tempTodos: this.state.tempTodos.concat([text])
    });
  }

  handleChange (e) {
  	this.setState({text: e.target.value});
  }

  handleDelete (todo) {
    server.emit('delete', {
      todo : todo
    });
  }

  handleToggle (todo, options) {
    todo.isCompleted = options.value || !todo.isCompleted;

    server.emit('update', {
      todo : todo
    });
  }

  handleToggleAll () {
    this.state.todos.forEach(todo => {
      this.handleToggle(todo, {value: true});
    });
  }

  handleDeleteAll () {
    this.state.todos.forEach(todo => {
      this.handleDelete(todo);
    });
  }

  render () {
    const listItems = this.state.todos.map(todo => {
      return (
        <li key={todo.id}>
          {todo.title}
          <button>Delete</button>
        </li>
      )
    });

    return (
	    <div className="todos">
        <h1 className="todos__title">todos</h1>
	    	<form className="todos__form" onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
		    	<input id="todo-input" type="text" className="todos__form__input" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder="Write a todo" />
		    	<button className="todos__form__submit" type="submit" value="Post">Submit</button>
	    	</form>
        <ul className="todos__list">
          {this.state.todos.map((todo) => {
            const 
              boundDelete = this.handleDelete.bind(this, todo),
              boundToggle = this.handleToggle.bind(this, todo);

            return (
              <li className="todos__list__item" key={todo.id}>
                <input className="todos__list__item__toggle" type="checkbox" id={"todo_" + todo.id} onChange={boundToggle} checked={todo.isCompleted} />
                <label htmlFor={"todo_" + todo.id} className={"todos__list__item__title" + (todo.isCompleted ? " m-state_completed" : "")} >{todo.title}</label>
                <button className="todos__list__item__button" onClick={boundDelete}>✕</button>
              </li>
            );
          }, this)}
        </ul>
        <ul className="todos__list m-state_disabled">
          {this.state.tempTodos.map((title, i) => {
            return (
              <li className="todos__list__item" key={i}>
                <input className="todos__list__item__toggle" type="checkbox" />
                <label className="todos__list__item__title" >{title}...</label>
                <button className="todos__list__item__button">✕</button>
              </li>
            );
          }, this)}
        </ul>
        <div className="todos__actions">
          <button className="todos__actions__toggle-all-button" onClick={this.handleToggleAll.bind(this)}>Mark all tasks as completed</button>
          <button className="todos__actions__delete-all-button" onClick={this.handleDeleteAll.bind(this)}>Delete all tasks</button>
        </div>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));



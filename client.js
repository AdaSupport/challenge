const server = io('http://localhost:3003/');

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: this._loadCache(),
      disabled: true
    };
    this.initServerCallbacks();
  }

  render() {
    return React.createElement('div', {className: 'todo-app'},
      React.createElement('div', {className: 'todo-header'}, 
        React.createElement('input', {className: 'todo-input', type: 'text', disabled: this.state.disabled, placeholder: 'Add a todo...', autoFocus: true}, null),
        React.createElement('input', {className: 'create-todo button', type: 'button', disabled: this.state.disabled, value: 'Make', onClick: this.createTodo}, null)),
      React.createElement(TodoList, {todos: this.state.todos, disabled: this.state.disabled}, null),
      React.createElement('div', {className: 'todo-footer'}, 
        React.createElement('input', {className: 'button', type: 'button', disabled: this.state.disabled, value: 'Complete All', onClick: this.completeAll}, null),
        React.createElement('input', {className: 'button', type: 'button', disabled: this.state.disabled, value: 'Delete All', onClick: this.deleteAll}, null)));
  }

  // Event Handlers
  //
  createTodo() {
    const input = document.querySelector('.todo-input');
    server.emit('make', { title : input.value });
    input.value = '';
    input.focus();
  }

  completeAll() {
    server.emit('complete-all');
  }

  deleteAll() {
    server.emit('delete-all');
  }

  // Server Callbacks
  //
  initServerCallbacks() {
    // Prevent users from interacting when server is down
    server.on('disconnect', () => {
      this.setState({disabled: true});
    });

    // Allow users to interact when connected to server
    server.on('connect', () => {
      this.setState({disabled: false});
    });

    // Reload the entire list of todos from the server
    server.on('load', (todos) => {
      const map = new Map();
      todos.map((todo) => map.set(todo.id, todo));
      this.setState({todos: map});
      this._saveCache(this.state.todos);
    });

    // Receive new todo from server
    server.on('new', (todo) => {
      this.state.todos.set(todo.id, todo);
      this.forceUpdate();
      this._saveCache(this.state.todos);
    });

    // Receive updated todo from server
    server.on('updated-todo', (todo) => {
      this.state.todos.set(todo.id, todo);
      this.forceUpdate();
      this._saveCache(this.state.todos);
    });

    // Receive deleted todo from server
    server.on('deleted-todo', (todo) => {
      this.state.todos.delete(todo.id);
      this.forceUpdate();
      this._saveCache(this.state.todos);
    });
  }

  // Helpers
  //
  _saveCache(todos) {
    window.localStorage.todos = JSON.stringify(Array.from(todos.entries()));
  }

  _loadCache() {
    if (!window.localStorage.todos) return new Map();
    return new Map(JSON.parse(window.localStorage.todos));
  }
}

class TodoList extends React.Component {

  renderCompleted() {
    if ([...this.props.todos.values()].filter((todo) => todo.completed).length > 0) {
      return React.createElement('div', {className: 'completed-todos-header'},
        React.createElement('span', null, 'Completed'));
    } else {
      return null;
    }
  }

  render() {
    return React.createElement('ul', {className: 'todo-list'},
      [...this.props.todos.values()].filter((todo) => !todo.completed).map((todo) => {
        return React.createElement(Todo, {key: todo.id, todo, disabled: this.props.disabled}, null);
      }),
      this.renderCompleted(),
      [...this.props.todos.values()].filter((todo) => todo.completed).map((todo) => {
        return React.createElement(Todo, {key: todo.id, todo, disabled: this.props.disabled}, null);
      })
    );
  }
}

class Todo extends React.Component {
  render() {
      return React.createElement('li', {className: 'todo-list-item'},
        React.createElement('input', {type: 'checkbox', className: 'todo-checkbox', disabled: this.props.disabled, checked: this.props.todo.completed, onChange: this.checkboxClick.bind(this)}, null),
        React.createElement('span', {className: 'todo-title', style: {textDecoration: this.props.todo.completed ? 'line-through' : 'none'}}, this.props.todo.title),
        React.createElement('input', {type: 'button', className: 'delete-todo', disabled: this.props.disabled, value: 'x', onClick: this.deleteClick}, null));
  }

  checkboxClick(event) {
    this.props.todo.completed = event.target.checked;
    server.emit('update', this.props.todo);
  }

  deleteClick() {
    server.emit('update', this.props.todo);
  }
}

ReactDOM.render(
  React.createElement(TodoApp),
  document.getElementById('root')
);

import _ from 'lodash';
import React, { Component } from 'react';
import TodosListHeader from './Todos-list-header.js'
import TodosListItem from './Todos-list-item.js'

class TodosList extends Component {
  renderItems = () => {
    const props = _.omit(this.props, 'todos');
    return _.map(this.props.todos, (todo,index) => <TodosListItem key={index} {...todo} {...props}/> )
  }

  render() {

    return (
      <div>
        <table>
          <TodosListHeader />
            <tbody>
              { this.renderItems() }
            </tbody>
        </table>
      </div>
    );
  }
}

export default TodosList;

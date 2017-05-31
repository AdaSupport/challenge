import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { CreateJumpstateMiddleware } from 'jumpstate'
import './index.css';
import TodosState from './state/todos'

const states = {
  tasks: TodosState
}

const store = createStore(
  combineReducers(states),
  applyMiddleware(
    CreateJumpstateMiddleware()
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();

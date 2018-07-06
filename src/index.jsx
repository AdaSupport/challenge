import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';

import { AppContainer } from './components/App.jsx';
import actionMiddleware from './actions/action_middleware';
import { clientReducer } from './reducers';
import { setState } from './actions';

const socket = io('http://localhost:3003/');
// creates a Redux store with a middleware function that emits actions to the socket.io server
const createStoreWithMiddleware = applyMiddleware(actionMiddleware(socket))(createStore);
const store = createStoreWithMiddleware(clientReducer);

socket.on('state', state => store.dispatch(setState(state)));

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('app')
)

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux"
import store from "./redux/store"
import { connect } from 'react-redux';
import './index.css';
// import Todos from './state/todos'

const StoreInstance = store()


ReactDOM.render(
  <Provider store={StoreInstance}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();

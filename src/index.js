import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import { Provider } from 'react-redux'
import store from './store'
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App/>
    </Provider>
  </div>
  ,document.getElementById('root'));
registerServiceWorker();


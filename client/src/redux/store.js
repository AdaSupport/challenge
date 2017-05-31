import { createStore, applyMiddleware } from 'redux';
// import {createLogger} from 'redux-logger';
// import thunk from "redux-thunk";
import rootReducer from "./reducers"

// const middleware = applyMiddleware(thunk, createLogger())


// export default createStore(reducer, middleware)

export default(initialState) => {
  return createStore(rootReducer, initialState);
}

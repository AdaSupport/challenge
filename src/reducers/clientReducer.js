import { Map } from 'immutable';

const INITIAL_STATE = Map();

const clientReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return state.merge(action.state);
  }
  return state;
}

export default clientReducer;

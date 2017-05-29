import { List, Map, fromJS } from 'immutable';
import { createStore } from 'redux';
import { expect } from 'chai';

import { serverReducer } from '../src/reducers';

describe('Redux store', () => {
  it('is configured properly with the correct reducer', () => {
    const store = createStore(serverReducer);

    expect(store.getState()).to.equal(Map({todoList: List()}));

    store.dispatch({
      type: 'LOAD_TODOS',
      todoList: [
        {title: 'test0', id:0, completed: false},
        {title: 'test1', id:1, completed: false},
        {title: 'test2', id:2, completed: false}
      ]
    });

    expect(store.getState()).to.equal(fromJS({
      todoList: [
        {title: 'test0', id:0, completed: false},
        {title: 'test1', id:1, completed: false},
        {title: 'test2', id:2, completed: false}
      ]
    }));
  })
});

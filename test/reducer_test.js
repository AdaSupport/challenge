import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';
import uuidV4 from 'uuid';

import { serverReducer } from '../src/reducers';

describe('serverReducer', () => {
  it('handles LOAD_TODOS', () => {
    const initialState = Map();
    const action = {type: 'LOAD_TODOS', todoList: [{title: 'test', id:0, completed: false}]};
    const nextState = serverReducer(initialState, action);

    expect(nextState).to.equal(Map({
      todoList: List.of(
        Map({title: 'test', id:0, completed: false})
      )
    }));
  });

  it('handles ADD_TODO', () => {
    const initialState = Map({todoList: List()});
    const action = {type: 'ADD_TODO', title: 'test'};
    const nextState = serverReducer(initialState, action);

    expect(nextState.get('todoList').size).to.equal(1);
    expect(nextState.get('todoList').last().get('title')).to.equal('test');
  });


  it('handles DELETE_TODO', () => {
    const initialState = Map({
      todoList: List.of(
        Map({title: 'test0', id:0, completed: false}),
        Map({title: 'test1', id:1, completed: false}),
        Map({title: 'test2', id:2, completed: false})
      )
    });
    const action = {type: 'DELETE_TODO', id: 1};
    const nextState = serverReducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      todoList: [
        {title: 'test0', id:0, completed: false},
        {title: 'test2', id:2, completed: false}
      ]
    }));
  });

  it('handles COMPLETE_TODO', () => {
    const initialState = Map({
      todoList: List.of(
        Map({title: 'test0', id:0, completed: false}),
        Map({title: 'test1', id:1, completed: false}),
        Map({title: 'test2', id:2, completed: false})
      )
    });
    const action = {type: 'COMPLETE_TODO', id: 0};
    const nextState = serverReducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      todoList: [
        {title: 'test0', id:0, completed: true},
        {title: 'test1', id:1, completed: false},
        {title: 'test2', id:2, completed: false}
      ]
    }));
  });

  it('handles COMPLETE_ALL', () => {
    const initialState = Map({
      todoList: List.of(
        Map({title: 'test0', id:0, completed: false}),
        Map({title: 'test1', id:1, completed: false}),
        Map({title: 'test2', id:2, completed: false})
      )
    });
    const action = {type: 'COMPLETE_ALL', title: 'test'};
    const nextState = serverReducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      todoList: [
        {title: 'test0', id:0, completed: true},
        {title: 'test1', id:1, completed: true},
        {title: 'test2', id:2, completed: true}
      ]
    }));
  });

  it('handles DELETE_ALL', () => {
    const initialState = Map({
      todoList: List.of(
        Map({title: 'test0', id:0, completed: false}),
        Map({title: 'test1', id:1, completed: false}),
        Map({title: 'test2', id:2, completed: false})
      )
    });
    const action = {type: 'DELETE_ALL'};
    const nextState = serverReducer(initialState, action);

    expect(nextState).to.equal(Map({todoList: List()}));
  });;
});

const chai = require('chai');
const should = chai.should();

const DB = require('./database');

describe("DB", function () {

    it('ensure extends array and loads fixture', () => {
        DB.should.have.length(6);
    });

    it('added tasks default to false', () => {
        const newTodo = DB.add({title: 'dummy todo'});
        DB.last.title.should.equal(newTodo.title);
        newTodo.done.should.equal(false);
    })

    it('toggle method works', () => {
        DB.toggleCompletionStatus(5);
        DB.last.done.should.equal(false);
    })

    it('remove method works', () => {
        const removed = DB.remove(6);
        DB.should.have.length(6);
        removed.title.should.equal('dummy todo');
    })

    it('completeAll method works', () => {
        DB.completeAll();
        DB.filter(todo=>todo.done).should.have.length(6);
    })

    it('removeAll method works', () => {
        DB.removeAll();
        DB.should.have.length(0);
    })

});

'use strict'

let expect = require('chai').expect;
let server = require('../server');
let io = require('socket.io-client');
let ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
};
let user1;

describe('Chat Events', function(){
    beforeEach(function(done){
        user1 = io('http://localhost:3003/', ioOptions);
        done();
    });

    afterEach(function(done){
        user1.disconnect();
        done();
    });

    describe('Display Todo list', function(){

        it('User should receive a todo list when its connected', function(done){
            user1.on('load', function(todoList){
                expect(todoList.db.length).to.be.above(0);
                done();
            })
        });

    });

    describe('Add an item to the Todo list', function(){

        it('User should be able to add an item to the todo list', function(done){

            let todo = 'Test Feed the dog';
            user1.on('load', function(todoList){
                if(todoList.db[0].title == todo){
                    expect(todoList.db[0].title).to.equal(todo);
                    done();
                }
            });
            user1.emit('service', {
                record: {title: todo},
                service : 'Add'
            });
        });

    });

    describe('Delete an item from the Todo list', function(){

        it('User should be able to delete an item from the todo list', function(done){

            let delteTodo = {};
            user1.on('load', function(todoList){
                if(todoList.status == 'Delete'){
                    expect(todoList.db[0].title).to.equal(delteTodo.title);
                    done();
                }
                else {
                    delteTodo = todoList.db[0];
                    user1.emit('service', {
                        records: [delteTodo],
                        service : 'Delete'
                    });
                }
            });

        });

    });

    describe('Complete an item in the Todo list', function(){

        it('User should be able to complete an item in the todo list', function(done){

            let delteTodo = {};
            user1.on('load', function(todoList){
                if(todoList.status == 'Complete'){
                    expect(todoList.db[0].title).to.equal(delteTodo.title);
                    done();
                }
                else {
                    delteTodo = todoList.db[0];
                    user1.emit('service', {
                        records: [delteTodo],
                        service : 'Complete'
                    });
                }
            });

        });

    })

});
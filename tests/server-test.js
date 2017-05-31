
var should = require('chai').should()
    , server = require('../server/server').socketIOServer
    , io = require('socket.io/node_modules/socket.io-client')
    , ioOptions = {
        transports: ['websocket']
        , forceNew: true
        , reconnection: false
    }
    , sender
    , receiver;

const Todo = require('../models/todo')

server.listen(3003)

describe('Server tests', function(){
    beforeEach(function(done){
        sender = io('http://localhost:3003/', ioOptions)
        receiver = io('http://localhost:3003/', ioOptions)
        done()
    })
    afterEach(function(done){

        sender.disconnect()
        receiver.disconnect()
        done()
    })

    describe('load test', function(){
        it('', function(done){
            receiver.on('load', function(data){
             data.length.should.be.greaterThan(0);
                done()
            })
        })
    })

    describe('todo transaction test', function(){

        it('should add todo', function(done){
            sender.emit('append', new Todo("test"))
            receiver.on('append', function(data){
                data.title.should.be.equal("test")
                done()
            })
        })

        it('remove correct index', function(done){
            sender.emit('remove', 0)
            receiver.on('remove', function(index){
                index.should.be.equal(0)
                done()
            })
        })

        it('set check on right index', function(done){
            sender.emit('setCheck', 0)
            receiver.on('setCheck', function(index){
                index.should.be.equal(0)
                done()
            })
        })

        //TODO: to add more tests for other socket events
    })

})
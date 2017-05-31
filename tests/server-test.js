
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



describe('Chat Events', function(){
    beforeEach(function(done){

        server.listen(3003)
        sender = io('http://localhost:3003/', ioOptions)
        receiver = io('http://localhost:3003/', ioOptions)
        done()
    })
    afterEach(function(done){

        sender.disconnect()
        receiver.disconnect()
        done()
    })

    describe('Message Events', function(){
        it('Clients should receive a message when the `message` event is emited.', function(done){
            receiver.on('load', function(data){
             data.length.should.be.greaterThan(0);
                done()
            })
        })
    })
})
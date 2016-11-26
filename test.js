var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');

var serverUrl = "http://localhost:3003/"; 


describe('server', function() {
  	it('should be able to add a task', function(done) {
  		var client1 = io.connect(serverUrl);
		var client2 = io.connect(serverUrl);

		var testTaskTitle1 = "Feed dat cat";
		var testTaskTitle2 = "Make dat money";

  		client1.on('connect', function() 
  		{
  			client1.emit('addTask', {
                title : testTaskTitle1
            });

            client2.on('refresh', function(data){
  				data[0].title.should.equal(testTaskTitle1);

    		});
  		});

  		client2.on('connect', function() 
  		{
  			client2.emit('addTask', {
                title : testTaskTitle2
            });
            
            client1.on('refresh', function(data){
  				data[0].title.should.equal(testTaskTitle1);

    		});
  		});

		client1.disconnect();
    	client2.disconnect();
    	done();
  	});

  	it('should be able to complete a task', function(done) {
  		var client1 = io.connect(serverUrl);
		var client2 = io.connect(serverUrl);

		var testTaskTitle1 = "Pet the cat";
		var testTaskTitle2 = "Assassinate hostile agent";

		var testTaskUuid1 = "000";
		var testTaskUuid2 = "007";

		var testIsComplete1 = true;
		var testIsComplete2 = true;

  		client1.on('connect', function() 
  		{
  			client1.emit('completeTask', {
		        title : testTaskTitle1,
		        uuid : testTaskUuid1,
		        isComplete : testIsComplete1
		    });

            client2.on('refresh', function(data){
  				data[0].title.should.equal(testTaskTitle1);
  				data[0].uuid.should.equal(testTaskUuid1);
  				data[0].isComplete.should.equal(testIsComplete1);
    		});
  		});

  		client2.on('connect', function() 
  		{
  			 client1.emit('completeTask', {
		        title : testTaskTitle2,
		        uuid : testTaskUuid2,
		        isComplete : testIsComplete2
		    });

            client2.on('refresh', function(data){
  				data[0].title.should.equal(testTaskTitle2);
  				data[0].uuid.should.equal(testTaskUuid2);
  				data[0].isComplete.should.equal(testIsComplete2);
    		});
  		});

		client1.disconnect();
    	client2.disconnect();
    	done();
  	});

	it('should be able to delete a task', function(done) {
		var client1 = io.connect(serverUrl);
		var client2 = io.connect(serverUrl);

		var testTaskTitle1 = "Feed dat cat";
		var testTaskTitle2 = "Make dat money";

		var testTaskUuid1 = "000";
		var testTaskUuid2 = "007";

  		client1.on('connect', function() 
  		{
  			client1.emit('deleteTask', {
		        title : testTaskTitle1,
		        uuid : testTaskUuid1
		    });

            client2.on('load', function(data){
  				for (task in data)
  				{
  					!data[0].title.should.equal(testTaskTitle1);
  					!data[0].uuid.should.equal(testTaskUuid1);
  				}
    		});
  		});

  		client2.on('connect', function() 
  		{
  			 client1.emit('deleteTask', {
		        title : testTaskTitle2,
		        uuid : testTaskUuid2
		    });

            client2.on('load', function(data){
  				for (task in data)
  				{
  					!data[0].title.should.equal(testTaskTitle2);
  					!data[0].uuid.should.equal(testTaskUuid2);
  				}
    		});
  		});

		client1.disconnect();
    	client2.disconnect();
    	done();
  	});
});
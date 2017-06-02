const 
	chai = require('chai'),
	expect = chai.expect,
	Server = require('./server'),
	DB = Server.DB,
	sampleText = "Do a vinyasa";

describe('Server', function() {
  it('It should push todos to the DB', function() {
		Server.createTodo({title: sampleText});

		expect(DB[DB.length - 1].title).to.equal(sampleText);
  });
});
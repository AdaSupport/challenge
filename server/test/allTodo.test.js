var request = require('supertest')
var server = require('../server')

describe("allTodo", function(){
  it("", function (done){
    request(server).get("/allTodos")
      .expect('Content-Type', /json/)
      .expect(200, done)
  })
})

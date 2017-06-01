var express = require('express');
var router = express.Router();
var Todo = require('../models/todo');


/* GET all todos . */
router.get('/allTodos', function(req, res, next) {
  Todo.find(function(err, todos){
    if(err) throw err
    console.log(todos)
    res.json(todos)
  })
});

// add new todo
router.post('/newTodo', function(req, res, next) {
  var title = req.body.title;
  var newTodo = new Todo({
    title: title
  });
  newTodo.save(function(err){
    if(err) throw err
  })
  console.log(newTodo)
  res.json(newTodo)
});

// delete todo
router.post("/remove", function(req, res){
  var todo = req.body.title
  console.log(req.body)
  Todo.findOneAndRemove({"title":todo}, function(err, todo){
    if(err) throw err
    console.log(todo)
    res.json(todo)
  })
})

// delete all todos
router.post("/removeAll", function(req, res){
  Todo.remove({}, function(err, todo){
    if(err) throw err
  })
})

module.exports = router;

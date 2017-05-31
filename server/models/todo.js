var mongoose = require('mongoose');
var express = require('express');


var TodoSchema = mongoose.Schema({
  title: {
    type: String
  }
});

var Todo = module.exports = mongoose.model('Todo', TodoSchema)

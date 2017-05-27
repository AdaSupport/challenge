var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

// express server config
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// listen for incoming connections on port 3003
http.listen(3003, function() {
  console.log('listening on *:3000');
});

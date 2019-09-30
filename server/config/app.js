var config = require('./config'), 
    mongoose = require('mongoose'),
    //bodyParser = require('body-parser'),
    express = require('./express'); // refers to express.js file in our application not Express the Middleware helper for Node.js
module.exports.start = function() {
  var app = express.init();
 // app.use(bodyParser.json());
  app.listen(config.port, function() {
    console.log('App.js file is listening on port', config.port);
  });
};
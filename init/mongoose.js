module.exports = function() {
  // Basic module
  var mongoose = require('mongoose');
  var nodemailer = require('./nodemailer.js');

  // Configuration
  var mongfig = require('../configs/mongoose.js');

  // models
  var Site = require('../models/Site.js');
  var Distributor = require('../models/Distributor.js');  
  var User = require('../models/User.js');

  // access to db
  var connection = mongoose.connection;

  // event callback
  connection.on('error', function(err) {
    nodemailer('init/mongoose.js', err.toString());
    console.log(err);
    process.exit();
  });
  connection.on('open', function() {
    console.log('MongoDB is Connected...');
  });
  connection.on('close', function() {
    nodemailer('init/mongoose.js', 'Connection Closed...');
    console.log('MongoDB is Closed.');
  });

  // db object
  var mdb = mongoose.connect(mongfig.url);

  // register models
  Site();
  Distributor();
  User();
  return mdb;
};

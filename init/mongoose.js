module.exports = function() {
    // Basic module
    var mongoose = require('mongoose');

    // Configuration
    var mongfig = require('../configs/mongoose.js');

    // models
    var User = require('../models/User.js');

    // access to db
    var connection = mongoose.connection;

    // event callback
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.on('open', function() {
        console.log('MongoDB is connected.');
    });

    // db object
    var mdb = mongoose.connect(mongfig.url);

    // register models
    User();
    return mdb;
};

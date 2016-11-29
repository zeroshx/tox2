module.exports = function() {
    // Basic module
    var mongoose = require('mongoose');
    var nodemailer = require('./nodemailer.js');

    // Configuration
    var mongfig = require('../configs/mongoose.js');

    // models
    var Site = require('../models/Site.js');
    var SiteLevel = require('../models/SiteLevel.js');
    var SiteConfig = require('../models/SiteConfig.js');

    var Distributor = require('../models/Distributor.js');

    var User = require('../models/User.js');

    var Match = require('../models/Match.js');
    var MatchKind = require('../models/MatchKind.js');
    var MatchLeague = require('../models/MatchLeague.js');

    var IPBlock = require('../models/IPBlock.js');
    var Blacklist = require('../models/Blacklist.js');

    var Question = require('../models/Question.js');
    var Message = require('../models/Message.js');

    var Deposit = require('../models/Deposit.js');
    var Withdrawal = require('../models/Withdrawal.js');
    var AssetReport = require('../models/AssetReport.js');

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
    User();
    Site();
    SiteLevel();
    SiteConfig();
    Distributor();
    Match();
    MatchKind();
    MatchLeague();
    Blacklist();
    IPBlock();
    Question();
    Message();
    Deposit();
    Withdrawal();
    AssetReport();

    return mdb;
};

module.exports = function() {
  // Basic module
  var mongoose = require('mongoose');
  var nodemailer = require('./nodemailer.js');

  // Configuration
  var mongfig = require('../configs/mongoose.js');

  // models
  var Site = require('../models/site.js');
  var SiteLevel = require('../models/site.level.js');
  var SiteConfig = require('../models/site.config.js');

  var Distributor = require('../models/distributor.js');

  var User = require('../models/user.js');
  var UserHistory = require('../models/user.history.js');

  var Match = require('../models/match.js');
  var MatchKind = require('../models/match.kind.js');
  var MatchLeague = require('../models/match.league.js');

  var IPBlock = require('../models/ipblock.js');
  var Blacklist = require('../models/blacklist.js');

  var Question = require('../models/question.js');
  var Message = require('../models/message.js');

  var Deposit = require('../models/deposit.js');
  var Withdrawal = require('../models/withdrawal.js');
  var AssetReport = require('../models/asset.report.js');

  var Todo = require('../models/todo.js');

  var Manager = require('../models/manager.js');

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
  UserHistory();
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
  Todo();
  Manager();

  return mdb;
};

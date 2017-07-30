module.exports = function() {
  // Basic module
  var mongoose = require('mongoose');

  // Configuration
  var mongfig = require('../configs/mongoose.js');

  // models
  var Site = require('../interfaces/site/model.js');
  var SiteLevel = require('../interfaces/site.level/model.js');
  var SiteBetting = require('../interfaces/site.betting/model.js');

  var Distributor = require('../interfaces/distributor/model.js');
  var DistributorLevel = require('../interfaces/distributor.level/model.js');

  var User = require('../interfaces/user/model.js');
  var UserHistory = require('../interfaces/user.history/model.js');

  var Match = require('../interfaces/match/model.js');
  var MatchKind = require('../interfaces/match.kind/model.js');
  var MatchLeague = require('../interfaces/match.league/model.js');

  var IPBlock = require('../interfaces/ipblock/model.js');
  var Blacklist = require('../interfaces/blacklist/model.js');

  var Question = require('../interfaces/question/model.js');
  var Message = require('../interfaces/message/model.js');

  var Deposit = require('../interfaces/deposit/model.js');
  var Withdrawal = require('../interfaces/withdrawal/model.js');
  var AssetReport = require('../interfaces/asset.report/model.js');

  var Board = require('../interfaces/board/model.js');

  var Todo = require('../interfaces/todo/model.js');

  var Manager = require('../interfaces/manager/model.js');

  var Loger = require('../interfaces/loger/model.js');

  var Messenger = require('../interfaces/messenger/model.js');

  // access to db
  var connection = mongoose.connection;

  // event callback
  connection.on('error', function(err) {
    console.log(err);
    process.exit();
  });
  connection.on('open', function() {
    console.log('MongoDB is Connected...');
  });
  connection.on('close', function() {
    console.log('MongoDB is Closed.');
  });

  // db object
  var mdb = mongoose.connect(mongfig.url);

  // register models
  User();
  UserHistory();
  Site();
  SiteLevel();
  SiteBetting();
  Distributor();
  DistributorLevel();
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
  Board();
  Loger();
  Messenger();

  return mdb;
};

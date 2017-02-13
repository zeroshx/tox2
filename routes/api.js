var express = require('express');
var router = express.Router();

var site = require('./apis/site.js');
var sitelevel = require('./apis/site.level.js');
var siteconfig = require('./apis/site.config.js');
var distributor = require('./apis/distributor.js');
var match = require('./apis/match.js');
var matchkind = require('./apis/match.kind.js');
var matchleague = require('./apis/match.league.js');
var blacklist = require('./apis/blacklist.js');
var ipblock = require('./apis/ipblock.js');
var user = require('./apis/user.js');
var userhistory = require('./apis/user.history.js');
var question = require('./apis/question.js');
var message = require('./apis/message.js');
var deposit = require('./apis/deposit.js');
var withdrawal = require('./apis/withdrawal.js');
var assetreport = require('./apis/asset.report.js');
var todo = require('./apis/todo.js');
var manager = require('./apis/manager.js');

router.use('/site', site);
router.use('/site/level', sitelevel);
router.use('/site/config', siteconfig);

router.use('/distributor', distributor);

router.use('/match', match);
router.use('/match/kind', matchkind);
router.use('/match/league', matchleague);

router.use('/config/ipblock', ipblock);
router.use('/config/blacklist', blacklist);
router.use('/config/manager', manager);

router.use('/user', user);
router.use('/user/history', userhistory);

router.use('/client/question', question);
router.use('/client/message', message);

router.use('/asset/deposit', deposit);
router.use('/asset/withdrawal', withdrawal);
router.use('/asset/report', assetreport);

router.use('/todo', todo);

module.exports = router;

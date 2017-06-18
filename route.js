var express = require('express');
var router = express.Router();

var gateway = require('./interfaces/gateway/controller.js');
var index = require('./interfaces/index/route.js');
var admin = require('./interfaces/admin/route.js');
var admin2 = require('./interfaces/admin2/route.js');
var customer = require('./interfaces/customer/route.js');
var customerConfig = require('./interfaces/customer.config/route.js');
var site = require('./interfaces/site/route.js');
var sitelevel = require('./interfaces/site.level/route.js');
var sitebetting = require('./interfaces/site.betting/route.js');
var distributor = require('./interfaces/distributor/route.js');
var match = require('./interfaces/match/route.js');
var matchkind = require('./interfaces/match.kind/route.js');
var matchleague = require('./interfaces/match.league/route.js');
var blacklist = require('./interfaces/blacklist/route.js');
var ipblock = require('./interfaces/ipblock/route.js');
var user = require('./interfaces/user/route.js');
var userhistory = require('./interfaces/user.history/route.js');
var question = require('./interfaces/question/route.js');
var message = require('./interfaces/message/route.js');
var deposit = require('./interfaces/deposit/route.js');
var withdrawal = require('./interfaces/withdrawal/route.js');
var assetreport = require('./interfaces/asset.report/route.js');
var todo = require('./interfaces/todo/route.js');
var manager = require('./interfaces/manager/route.js');
var board = require('./interfaces/board/route.js');

router.use(gateway.InputTrim);
router.use('/admin', admin);
router.use('/admin2', admin2);
router.use('/customer', customer);
router.use('/customer-config', customerConfig);
router.use('/site/level', sitelevel);
router.use('/site/betting', sitebetting);
router.use('/site', site);
router.use('/distributor', distributor);
router.use('/match/kind', matchkind);
router.use('/match/league', matchleague);
router.use('/match', match);
router.use('/config/ipblock', ipblock);
router.use('/config/blacklist', blacklist);
router.use('/config/manager', manager);
router.use('/user/history', userhistory);
router.use('/user', user);
router.use('/client/board', board);
router.use('/client/question', question);
router.use('/client/message', message);
router.use('/asset/deposit', deposit);
router.use('/asset/withdrawal', withdrawal);
router.use('/asset/report', assetreport);
router.use('/todo', todo);
router.use('/', index);

module.exports = router;
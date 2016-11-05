var express = require('express');
var router = express.Router();

var index = require('./index.js');
var auth = require('./auth.js');
var site = require('./site.js');
var sitelevel = require('./sitelevel.js');
var siteconfig = require('./siteconfig.js');
var distributor = require('./distributor.js');
var match = require('./match.js');
var matchkind = require('./matchkind.js');
var matchleague = require('./matchleague.js');
var blacklist = require('./blacklist.js');
var ipblock = require('./ipblock.js');

router.use('/', index);

router.use('/auth', auth);

router.use('/site', site);
router.use('/site/level', sitelevel);
router.use('/site/config', siteconfig);

router.use('/distributor', distributor);

router.use('/match', match);
router.use('/match/kind', matchkind);
router.use('/match/league', matchleague);

router.use('/config/ipblock', ipblock);
router.use('/config/blacklist', blacklist);

module.exports = router;

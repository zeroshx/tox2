var express = require('express');
var router = express.Router();

var index = require('./index.js');
var auth = require('./auth.js');
var site = require('./site.js');
var distributor = require('./distributor.js');
var match = require('./match.js');
var matchkind = require('./matchkind.js');
var matchleague = require('./matchleague.js');

router.use('/', index);
router.use('/auth', auth);
router.use('/site', site);
router.use('/distributor', distributor);
router.use('/match', match);
router.use('/match/kind', matchkind);
router.use('/match/league', matchleague);

module.exports = router;

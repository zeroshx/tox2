var express = require('express');
var router = express.Router();

var index = require('./index.js');
var auth = require('./auth.js');
var site = require('./site.js');
var distributor = require('./distributor.js');
var match = require('./match.js');

router.use('/', index);
router.use('/auth', auth);
router.use('/site', site);
router.use('/distributor', distributor);
router.use('/match', match);

module.exports = router;

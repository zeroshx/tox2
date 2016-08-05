var express = require('express');
var router = express.Router();

var index = require('./index.js');
var auth = require('./auth.js');
var site = require('./site.js');
var distributor = require('./distributor.js');

router.use('/', index);
router.use('/auth', auth);
router.use('/site', site);
router.use('/distributor', distributor);

module.exports = router;

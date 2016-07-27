var express = require('express');
var router = express.Router();

var index = require('./index.js');
var auth = require('./auth.js');

router.use('/', index);
router.use('/auth', auth);

module.exports = router;

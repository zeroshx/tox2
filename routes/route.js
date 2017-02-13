var express = require('express');
var router = express.Router();

var index = require('./index.js');
var admin = require('./admin.js');
var customer = require('./customer.js');
var api = require('./api.js');

router.use('/', index);
router.use('/api', api);
router.use('/admin', admin);
router.use('/customer', customer);

module.exports = router;

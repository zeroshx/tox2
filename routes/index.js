// basic modules
var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/index.js');

/* GET home page. */
router.get('/',
  capi.refreshSession,
  ctrl.index
);

module.exports = router;

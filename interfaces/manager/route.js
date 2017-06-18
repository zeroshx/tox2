var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  permission.VerifyAdminApi,
  ctrl.One
);

router.post('/',
  permission.VerifyAdminApi,
  ctrl.Upsert
);

module.exports = router;

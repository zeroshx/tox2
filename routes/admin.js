var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/admin.js');
var api = require('./api.js');

router.get('/',
  capi.VerifyAdmin,
  ctrl.AdminApp
);

router.get('/menu',
  capi.VerifyAdmin,
  ctrl.AdminMenu
);

module.exports = router;

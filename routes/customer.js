var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/customer.js');
var api = require('./api.js');

router.get('/config',
  capi.VerifyUser,
  ctrl.CustomerConfig
);

router.post('/config',
  capi.VerifyUser,
  ctrl.SubmitCustomerConfig
);

router.post('/check-nick',
  capi.VerifyUser,
  ctrl.CheckNick
);

router.get('/',
  capi.VerifyUser,
  ctrl.CustomerApp
);

module.exports = router;

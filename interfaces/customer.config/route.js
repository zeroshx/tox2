var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  permission.VerifySemiUser,
  ctrl.CustomerConfig
);

router.post('/',
  permission.VerifySemiUser,
  ctrl.SubmitCustomerConfig
);

router.post('/check-nick',
  permission.VerifySemiUser,
  ctrl.CheckNick
);


module.exports = router;

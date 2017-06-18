var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  ctrl.CustomerConfig
);

router.post('/',
  ctrl.SubmitCustomerConfig
);

router.post('/check-nick',
  ctrl.CheckNick
);


module.exports = router;

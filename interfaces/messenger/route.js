var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  permission.VerifySupervisorApi,
  ctrl.List
);

router.post('/',
  permission.VerifySupervisorApi,
  ctrl.Create
);


module.exports = router;

var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  permission.VerifySupervisor,
  ctrl.AdminApp
);

router.get('/menu',
  permission.VerifySupervisor,
  ctrl.AdminMenu
);

module.exports = router;

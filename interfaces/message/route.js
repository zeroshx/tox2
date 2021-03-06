var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.post('/',
  permission.VerifySupervisorApi,
  ctrl.Create
);

router.get('/',
  permission.VerifySupervisorApi,
  ctrl.List
);

router.put('/:id',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

router.get('/customer/new-received-list',
  permission.VerifyUserApi,
  ctrl.NewReceivedMessage
);

router.get('/customer/new-count',
  permission.VerifyUserApi,
  ctrl.NewMessage
);

router.get('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerList
);

router.get('/customer/one/:id',
  permission.VerifyUserApi,
  ctrl.CustomerMessage
);

router.post('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerCreate
);

module.exports = router;

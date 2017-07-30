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

router.get('/one',
  permission.VerifySupervisorApi,
  ctrl.One
);
//
// router.put('/:id',
//   permission.VerifySupervisorApi,
//   ctrl.Update
// );

router.put('/answer',
  permission.VerifySupervisorApi,
  ctrl.Answer
);

router.put('/postpone',
  permission.VerifySupervisorApi,
  ctrl.Postpone
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

router.get('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerList
);

router.get('/customer/:id',
  permission.VerifyUserApi,
  ctrl.CustomerQuestion
);

router.post('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerCreate
);

module.exports = router;

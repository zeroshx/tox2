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

router.put('/accept/:id',
  permission.VerifySupervisorApi,
  ctrl.Accept
);

router.put('/cancel/:id',
  permission.VerifySupervisorApi,
  ctrl.Cancel
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

router.get('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerList
);

router.post('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerCreate
);


module.exports = router;

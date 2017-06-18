var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.post('/',
  permission.VerifyAdminApi,
  ctrl.Create
);

router.get('/',
  permission.VerifyAdminApi,
  ctrl.List
);

router.put('/:id',
  permission.VerifyAdminApi,
  ctrl.Update
);

router.put('/accept/:id',
  permission.VerifyAdminApi,
  ctrl.Accept
);

router.put('/cancel/:id',
  permission.VerifyAdminApi,
  ctrl.Cancel
);

router.delete('/:id',
  permission.VerifyAdminApi,
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

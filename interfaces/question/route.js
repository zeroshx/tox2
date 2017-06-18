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
//
// router.put('/:id',
//   permission.VerifyAdminApi,
//   ctrl.Update
// );

router.put('/answer',
  permission.VerifyAdminApi,
  ctrl.Answer
);

router.put('/postpone',
  permission.VerifyAdminApi,
  ctrl.Postpone
);

router.delete('/:id',
  permission.VerifyAdminApi,
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

var express = require('express');
var router = express.Router();

// controller
var capi = require('../../controllers/common.js');
var ctrl = require('../../controllers/apis/deposit.js');

router.post('/',
  capi.VerifyAdminApi,
  ctrl.Create
);


router.get('/',
  capi.VerifyAdminApi,
  ctrl.List
);

router.put('/:id',
  capi.VerifyAdminApi,
  ctrl.Update
);

router.put('/accept/:id',
  capi.VerifyAdminApi,
  ctrl.Accept
);

router.delete('/:id',
  capi.VerifyAdminApi,
  ctrl.Delete
);

router.get('/customer',
  capi.VerifyUserApi,
  ctrl.CustomerList
);

router.post('/customer',
  capi.VerifyUserApi,
  ctrl.CustomerCreate
);

module.exports = router;

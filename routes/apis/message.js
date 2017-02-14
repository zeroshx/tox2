var express = require('express');
var router = express.Router();

// controller
var capi = require('../../controllers/common.js');
var ctrl = require('../../controllers/apis/message.js');

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

router.put('/check/:id',
  capi.VerifyAdminApi,
  ctrl.Check
);

router.delete('/:id',
  capi.VerifyAdminApi,
  ctrl.Delete
);

router.get('/new',
  capi.VerifyUserApi,
  ctrl.CheckNewMessage
);

module.exports = router;

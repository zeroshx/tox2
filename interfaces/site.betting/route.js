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

router.put('/',
  permission.VerifyAdminApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifyAdminApi,
  ctrl.Delete
);

module.exports = router;

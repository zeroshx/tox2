var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

// for sites list
router.get('/',
  permission.VerifyAdminApi,
  ctrl.List
);

// for creating new site
router.post('/',
  permission.VerifyAdminApi,
  ctrl.Create
);

router.put('/',
  permission.VerifyAdminApi,
  ctrl.Update
);

router.put('/memo',
  permission.VerifyAdminApi,
  ctrl.Memo
);

router.put('/money',
  permission.VerifyAdminApi,
  ctrl.Money
);

router.get('/details',
  permission.VerifyAdminApi,
  ctrl.Details
);

// create new site
router.delete('/:id',
  permission.VerifyAdminApi,
  ctrl.Delete
);

router.get('/me',
  permission.VerifyUserApi,
  ctrl.Me
);

router.get('/session',
  permission.VerifyUserApi,
  ctrl.Session
);

module.exports = router;

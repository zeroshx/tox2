var express = require('express');
var router = express.Router();

// controller
var capi = require('../../controllers/common.js');
var ctrl = require('../../controllers/apis/user.js');

// for sites list
router.get('/',
  capi.VerifyAdminApi,
  ctrl.List
);

// for creating new site
router.post('/',
  capi.VerifyAdminApi,
  ctrl.Create
);

// create new site
router.put('/:id',
  capi.VerifyAdminApi,
  ctrl.Update
);

// create new site
router.delete('/:id',
  capi.VerifyAdminApi,
  ctrl.Delete
);

router.get('/me',
  capi.VerifyAdminApi,
  ctrl.Me
);

router.get('/session',
  capi.VerifyAdminApi,
  ctrl.Session
);

module.exports = router;

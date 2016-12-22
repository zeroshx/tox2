var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/user.js');

// for sites list
router.get('/',
  capi.VerifyAdmin,
  ctrl.List
);

// for creating new site
router.post('/',
  capi.VerifyAdmin,
  ctrl.Create
);

// create new site
router.put('/:id',
  capi.VerifyAdmin,
  ctrl.Update
);

// create new site
router.delete('/:id',
  capi.VerifyAdmin,
  ctrl.Delete
);

router.get('/me',
  capi.VerifyAdmin,
  ctrl.Me
);

module.exports = router;

var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/message.js');

router.post('/',
  capi.VerifyAdmin,
  ctrl.Create
);

router.get('/',
  capi.VerifyAdmin,
  ctrl.List
);

router.put('/:id',
  capi.VerifyAdmin,
  ctrl.Update
);

router.put('/check/:id',
  capi.VerifyAdmin,
  ctrl.Check
);

router.delete('/:id',
  capi.VerifyAdmin,
  ctrl.Delete
);

module.exports = router;

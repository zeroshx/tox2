var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/match.kind.js');

router.post('/',
  capi.VerifyAdmin,
    ctrl.Create
);

router.get('/',
  capi.VerifyAdmin,
    ctrl.List
);

router.get('/all',
  capi.VerifyAdmin,
    ctrl.ListAll
);

router.put('/:id',
  capi.VerifyAdmin,
    ctrl.Update
);

router.delete('/:id',
  capi.VerifyAdmin,
    ctrl.Delete
);


module.exports = router;
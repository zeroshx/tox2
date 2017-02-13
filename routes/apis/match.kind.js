var express = require('express');
var router = express.Router();

// controller
var capi = require('../../controllers/common.js');
var ctrl = require('../../controllers/apis/match.kind.js');

router.post('/',
  capi.VerifyAdminApi,
    ctrl.Create
);

router.get('/',
  capi.VerifyAdminApi,
    ctrl.List
);

router.get('/all',
  capi.VerifyAdminApi,
    ctrl.ListAll
);

router.put('/:id',
  capi.VerifyAdminApi,
    ctrl.Update
);

router.delete('/:id',
  capi.VerifyAdminApi,
    ctrl.Delete
);


module.exports = router;

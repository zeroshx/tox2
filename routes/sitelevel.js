var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/sitelevel.js');

router.post('/',
  ctrl.Create
);

router.get('/',
  ctrl.List
);

router.get('/all',
  ctrl.ListAll
);

router.get('/forsite/:site',
  ctrl.ListForSite
);

router.put('/:id',
  ctrl.Update
);

router.delete('/:id',
  ctrl.Delete
);

module.exports = router;

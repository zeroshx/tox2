var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/distributor.js');

// for distributors list
router.get('/',
  ctrl.list
);

// for a distributor info
router.get('/:distId',
  ctrl.single
);

// for creating new distributor
router.post('/',
  ctrl.create
);

// update distributor
router.put('/',
  ctrl.update
);

// delete distributor
router.delete('/:distId',
  ctrl.delete
);

module.exports = router;

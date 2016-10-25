var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/site.js');

router.post('/',
  ctrl.create
);

router.get('/',
  ctrl.list
);

// router.get('/:id',
//   ctrl.list
// );

router.put('/:id',
  ctrl.update
);

router.delete('/:id',
  ctrl.delete
);

module.exports = router;

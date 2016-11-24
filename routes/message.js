var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/message.js');

router.post('/',
  ctrl.Create
);

router.get('/',
  ctrl.List
);

router.put('/:id',
  ctrl.Update
);

router.put('/check/:id',
  ctrl.Check
);

router.delete('/:id',
  ctrl.Delete
);

module.exports = router;

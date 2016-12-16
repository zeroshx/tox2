var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/blacklist.js');

// router.all('/', capi.authenticate);

router.post('/',
  ctrl.Create
);

router.get('/',
  ctrl.List
);

router.put('/:id',
  ctrl.Update
);

router.delete('/:id',
  ctrl.Delete
);

module.exports = router;

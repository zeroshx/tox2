var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/user.js');

// for sites list
router.get('/',
  ctrl.List
);

// for creating new site
router.post('/',
  ctrl.Create
);

// create new site
router.put('/:id',
  ctrl.Update
);

// create new site
router.delete('/:id',
  ctrl.Delete
);

module.exports = router;

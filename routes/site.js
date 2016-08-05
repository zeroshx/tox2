var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/site.js');

// for sites list
router.get('/',
  ctrl.list
);

// for a site info
router.get('/:siteId',
  ctrl.single
);

// for creating new site
router.post('/',
  ctrl.create
);

// create new site
router.put('/',
  ctrl.update
);

// create new site
router.delete('/:siteId',
  ctrl.delete
);

module.exports = router;

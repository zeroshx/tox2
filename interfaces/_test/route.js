var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.post('/',
  permission.VerifySupervisorApi,
  ctrl.Post
);

router.get('/',
  permission.VerifySupervisorApi,
  ctrl.Get
);

router.put('/:id',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

module.exports = router;

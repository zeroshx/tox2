var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.post('/',
  permission.VerifySupervisorApi,
  ctrl.Create
);

router.get('/',
  permission.VerifySupervisorApi,
  ctrl.List
);

router.get('/all',
  permission.VerifySupervisorApi,
  ctrl.ListAll
);

router.put('/',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

module.exports = router;

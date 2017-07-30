var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

// for sites list
router.get('/',
  permission.VerifySupervisorApi,
  ctrl.List
);

router.get('/download',
  permission.VerifySupervisorApi,
  ctrl.Download
);

// for creating new site
router.post('/',
  permission.VerifySupervisorApi,
  ctrl.Create
);

router.put('/',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.post('/memo',
  permission.VerifySupervisorApi,
  ctrl.AddMemo
);

router.put('/memo',
  permission.VerifySupervisorApi,
  ctrl.RemoveMemo
);

router.put('/money',
  permission.VerifySupervisorApi,
  ctrl.Money
);

router.get('/details',
  permission.VerifySupervisorApi,
  ctrl.Details
);

// create new site
router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

router.get('/me',
  permission.VerifyUserApi,
  ctrl.Me
);

router.get('/session',
  permission.VerifyUserApi,
  ctrl.Session
);

module.exports = router;

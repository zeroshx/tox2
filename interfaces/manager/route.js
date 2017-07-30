var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.get('/',
  permission.VerifySupervisorApi,
  ctrl.One
);

router.post('/signup',
  permission.VerifySupervisorApi,
  ctrl.SignupConfig
);

router.get('/messenger/room',
  permission.VerifySupervisorApi,
  ctrl.GetMessengerRoom
);

router.post('/messenger/room',
  permission.VerifySupervisorApi,
  ctrl.AddMessengerRoom
);

router.put('/messenger/room',
  permission.VerifySupervisorApi,
  ctrl.RemoveMessengerRoom
);

router.get('/realtime',
  permission.VerifySupervisorApi,
  ctrl.GetRealtimeNotification
);

router.put('/realtime',
  permission.VerifySupervisorApi,
  ctrl.CheckRealtimeNotification
);

module.exports = router;

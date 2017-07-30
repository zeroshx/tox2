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

router.get('/forsite/:site',
  permission.VerifySupervisorApi,
  ctrl.ListForSite
);

router.put('/',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

router.get('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerDistributor
);

router.get('/customer/member',
  permission.VerifyUserApi,
  ctrl.CustomerDistributorMember
);

router.get('/customer/forsite',
  permission.VerifyUserApi,
  ctrl.CustomerListForSite
);

router.post('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerCreate
);

router.post('/customer/join',
  permission.VerifyUserApi,
  ctrl.CheckJoinCondition,
  ctrl.Join
);

router.put('/customer/modify',
  permission.VerifyUserApi,
  ctrl.CustomerUpdate
);

router.put('/customer/accept',
  permission.VerifyUserApi,
  ctrl.AwaiterAccept
);

router.put('/customer/reject',
  permission.VerifyUserApi,
  ctrl.AwaiterReject
);

router.put('/customer/reject/all',
  permission.VerifyUserApi,
  ctrl.AwaiterRejectAll
);

router.put('/customer/dropout',
  permission.VerifyUserApi,
  ctrl.DropOut
);

router.put('/customer/handover',
  permission.VerifyUserApi,
  ctrl.HandOver
);

router.put('/customer/expell',
  permission.VerifyUserApi,
  ctrl.Expell
);

module.exports = router;

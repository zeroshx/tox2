var express = require('express');
var router = express.Router();

// controller
var permission = require('../permission.handler.js');
var ctrl = require('./controller.js');

router.post('/',
  permission.VerifyAdminApi,
  ctrl.Create
);

router.get('/',
  permission.VerifyAdminApi,
  ctrl.List
);

router.get('/all',
  permission.VerifyAdminApi,
  ctrl.ListAll
);

router.get('/forsite/:site',
  permission.VerifyAdminApi,
  ctrl.ListForSite
);

router.put('/',
  permission.VerifyAdminApi,
  ctrl.Update
);

router.delete('/:id',
  permission.VerifyAdminApi,
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

router.get('/customer/config',
  permission.VerifyUserApi,
  ctrl.Config
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

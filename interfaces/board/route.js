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

router.get('/one',
  permission.VerifySupervisorApi,
  ctrl.One
);

router.put('/',
  permission.VerifySupervisorApi,
  ctrl.Update
);

router.put('/show',
  permission.VerifySupervisorApi,
  ctrl.ShowToggle
);

router.delete('/:id',
  permission.VerifySupervisorApi,
  ctrl.Delete
);

/* Reply part */
router.post('/reply',
  permission.VerifySupervisorApi,
  ctrl.CreateReply
);

router.get('/reply',
  permission.VerifySupervisorApi,
  ctrl.ReplyList
);

router.put('/reply',
  permission.VerifySupervisorApi,
  ctrl.DeleteReply
);


router.get('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerList
);

router.post('/customer',
  permission.VerifyUserApi,
  ctrl.CustomerCreate
);

router.get('/customer/:id',
  permission.VerifyUserApi,
  ctrl.CustomerWriting
);

router.delete('/customer/:id',
  permission.VerifyUserApi,
  ctrl.CustomerDelete
);

router.post('/customer/reply',
  permission.VerifyUserApi,
  ctrl.CustomerCreateReply
);

router.put('/customer/opinion',
  permission.VerifyUserApi,
  ctrl.CustomerOpinion
);

router.get('/distributor',
  permission.VerifyUserApi,
  ctrl.DistributorList
);

router.get('/distributor/:id',
  permission.VerifyUserApi,
  ctrl.DistributorWriting
);

router.post('/distributor',
  permission.VerifyUserApi,
  ctrl.DistributorCreate
);

router.post('/distributor/reply',
  permission.VerifyUserApi,
  ctrl.DistributorCreateReply
);

router.put('/distributor/opinion',
  permission.VerifyUserApi,
  ctrl.DistributorOpinion
);

module.exports = router;

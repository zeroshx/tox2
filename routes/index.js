// basic modules
var passport = require('passport');
var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/index.js');

/* GET home page with login form */
router.get('/',
  capi.AuthRouting,
  ctrl.Index
);

router.get('/signup',
  ctrl.Signup
);

router.get('/logout',
  ctrl.Logout
);

router.post('/signup',
  ctrl.HandleSignup
);

router.post('/login',
  ctrl.HandleLogin
);

router.post('/request',
  ctrl.RequestGuestService
);

module.exports = router;

// basic modules
var passport = require('passport');
var express = require('express');
var router = express.Router();

// controller
var ctrl = require('./controller.js');

/* GET home page with login form */
router.get('/',
  ctrl.Index
);

router.get('/signup',
  ctrl.Signup
);

router.get('/logout',
  ctrl.Logout
);

router.post('/signup',
  ctrl.CheckBlockIP,
  ctrl.HandleSignup,
  ctrl.PassAuthentication
);

router.post('/login',
  ctrl.CheckBlockIP,
  ctrl.HandleLogin,
  ctrl.CheckBlacklist,
  ctrl.PassAuthentication
);

router.post('/request',
  ctrl.RequestVisitorQuestion
);

module.exports = router;

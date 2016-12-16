var passport = require('passport');
var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/auth.js');

router.post('/signup',
  passport.authenticate('local-signup'),
  ctrl.signup
);

router.post('/login',
  passport.authenticate('local-login'),
  ctrl.login
);

router.get('/logout',
  ctrl.logout
);

router.get('/alive',
  ctrl.alive
);

router.post('/checkemail',
  ctrl.checkEmail
);

router.post('/checknick',
  ctrl.checkNick
);

router.get('/me',
  ctrl.me
);

module.exports = router;

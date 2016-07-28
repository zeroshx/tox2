var passport = require('passport');
var express = require('express');
var router = express.Router();

// controller
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

module.exports = router;

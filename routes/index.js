// basic modules
var passport = require('passport');
var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/index.js');

/* GET home page with login form */
router.get('/',
  ctrl.index
);

router.get('/signup',
  ctrl.signup
);

router.get('/usersetting', function(req, res) {
    res.send("usersetting <a href=\"/logout\">Logout</a>");
});

router.get('/main', function(req, res) {
    res.send("main <a href=\"/logout\">Logout</a>");
});

router.get('/logout',
  ctrl.logout
);

router.post('/signup',
  ctrl.RequestSignup
);

router.post('/login',
  ctrl.RequestLogin
);

router.post('/request',
  ctrl.RequestNonmemberService
);

module.exports = router;

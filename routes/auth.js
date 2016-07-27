var passport = require('passport');
var express = require('express');
var router = express.Router();

router.post('/signup',
  passport.authenticate('local-signup'),
  function(req, res) {
    console.log(req.user);
    res.json(req.user);
  }
);

router.post('/login',
  passport.authenticate('local-login'),
  function(req, res) {
    console.log(req.user);
    res.json(req.user);
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

router.get('/alive', function(req, res) {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
};

module.exports = router;

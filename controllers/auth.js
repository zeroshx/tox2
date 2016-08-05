var User = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');

exports.signup = function(req, res) {
  if (req.session.passport.user.hasOwnProperty('failure')) {
    var fail = req.user;
    delete req.session.passport;
    delete req.user;
    res.json(fail);
    return;
  }
  res.json(req.user);
};

exports.login = function(req, res) {
  if (req.session.passport.user.hasOwnProperty('failure')) {
    var fail = req.user;
    delete req.session.passport;
    delete req.user;
    res.json(fail);
    return;
  }
  res.json(req.user);
};

exports.logout = function(req, res) {
  req.logout();
  res.sendStatus(200);
};

exports.alive = function(req, res) {
  if (req.isAuthenticated()) {
    res.json({
      session: true
    });
  } else {
    res.json({
      session: false
    });
  }
};

exports.checkEmail = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      res.sendStatus(500);
    }
    if (user) {
      res.json({
        exist: true
      });
    } else {
      res.json({
        exist: false
      });
    }
  });
};

exports.checkNick = function(req, res) {
  User.findOne({
    nick: req.body.nick
  }, function(err, user) {
    if (err) {
      res.sendStatus(500);
    }
    if (user) {
      res.json({
        exist: true
      });
    } else {
      res.json({
        exist: false
      });
    }
  });
};

exports.me = function(req, res) {
  User.findOne({
      _id: req.user._id
    })
    .populate('site distributor')
    .select('-password')
    .exec(function(err, user) {
      if (err) {
        nodemailer('controllers/auth.js:me', JSON.stringify(err));
        return res.sendStatus(500);
      }
      return res.json(user);
    });
};

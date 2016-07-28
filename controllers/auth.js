var User = require('mongoose').model('User');

exports.signup = function(req, res) {
  res.json(req.user);
};

exports.login = function(req, res) {
  res.json(req.user);
};

exports.logout = function(req, res) {
  req.logout();
  res.sendStatus(200);
};

exports.alive = function(req, res) {
  var result = {
    session : true
  };
  if (req.isAuthenticated()) {
    res.json(result);
  } else {
    result.session = false;
    res.json(result);
  }
};

exports.checkEmail = function(req, res) {
  console.log(req.body.email);
  User.findOne({email : req.body.email}, function (err, user) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    var result = {
      exist : true
    };
    if(user) {
      res.json(result);
    } else {
      result.exist = false;
      res.json(result);
    }
  });
};

exports.checkNick = function(req, res) {
  console.log(req.body.nick);
  User.findOne({nick : req.body.nick}, function (err, user) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    var result = {
      exist : true
    };
    if(user) {
      res.json(result);
    } else {
      result.exist = false;
      res.json(result);
    }
  });
};

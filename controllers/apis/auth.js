var Model = require('mongoose').model('User');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/user.js';

exports.alive = function(req, res) {
  // if (req.isAuthenticated()) {
  //     return res.sendStatus(200);
  // } else {
  //     return res.sendStatus(500);
  // }
};

exports.checkEmail = function(req, res) {
  Model.CheckEmail(
    req.body.email,
    function(err, msg) {
      if (err) { // internal error
        nodemailer(root + ':checkEmail', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.sendStatus(200);
      }
    });
};

exports.checkNick = function(req, res) {
  Model.CheckNick(
    req.body.nick,
    function(err, msg) {
      if (err) { // internal error
        nodemailer(root + ':checkNick', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.sendStatus(200);
      }
    });
};

exports.me = function(req, res) {
  Model.Me(
    req.user._id,
    function(err, msg, me) {
      if (err) { // internal error
        nodemailer(root + ':me', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(me);
      }
    });
};

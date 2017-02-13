var validator = require('../validator.js');
var Model = require('mongoose').model('UserHistory');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/user.history.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
    req.query.state,
    req.query.site,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':List', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Create = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.ip,
    validator: 'ip'
  }, {
    required: true,
    value: req.body.state,
    validator: 'historyState'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.nick,
    req.body.site,
    req.body.domain,
    req.body.ip,
    req.body.state,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Create', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Update = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.ip,
    validator: 'ip'
  }, {
    required: true,
    value: req.body.state,
    validator: 'historyState'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.domain,
    req.body.ip,
    req.body.state,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Update', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Delete = function(req, res) {
  Model.Delete(
    req.params.id,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Delete', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

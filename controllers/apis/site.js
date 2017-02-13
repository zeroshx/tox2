var validator = require('../validator.js');
var Model = require('mongoose').model('Site');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/site.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
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

exports.ListAll = function(req, res) {
  Model.ListAll(function(err, msg, doc) {
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
    value: req.body.state,
    validator: 'siteState'
  }, {
    required: true,
    value: req.body.name,
    validator: 'site'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }, {
    required: true,
    value: req.body.configLevel,
    validator: 'level'
  }, {
    required: true,
    value: req.body.configCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.configMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.configPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.bonusWin,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusLose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusFirstDeposit,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusDeposit,
    validator: 'bonus'
  }, {
    required: false,
    value: req.body.answer,
    validator: 'siteAnswer'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.state,
    req.body.name,
    req.body.configLevel,
    req.body.configCash,
    req.body.configMoney,
    req.body.configPoint,
    req.body.bonusWin,
    req.body.bonusLose,
    req.body.bonusFirstDeposit,
    req.body.bonusDeposit,
    req.body.answer,
    req.body.memo,
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
    value: req.body.state,
    validator: 'siteState'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }, {
    required: true,
    value: req.body.configLevel,
    validator: 'level'
  }, {
    required: true,
    value: req.body.configCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.configMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.configPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.bonusWin,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusLose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusFirstDeposit,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusDeposit,
    validator: 'bonus'
  }, {
    required: false,
    value: req.body.answer,
    validator: 'siteAnswer'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.state,
    req.body.configLevel,
    req.body.configCash,
    req.body.configMoney,
    req.body.configPoint,
    req.body.bonusWin,
    req.body.bonusLose,
    req.body.bonusFirstDeposit,
    req.body.bonusDeposit,
    req.body.answer,
    req.body.memo,
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

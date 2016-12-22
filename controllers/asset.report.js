var validator = require('./validator.js');
var Model = require('mongoose').model('AssetReport');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/assetreport.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
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
    value: req.body.beforeCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.beforeMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.beforePoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.beforeDebt,
    validator: 'debt'
  }, {
    required: true,
    value: req.body.afterCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.afterMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.afterPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.afterDebt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.nick,
    req.body.site,
    req.body.beforeCash,
    req.body.beforeMoney,
    req.body.beforePoint,
    req.body.beforeDebt,
    req.body.afterCash,
    req.body.afterMoney,
    req.body.afterPoint,
    req.body.afterDebt,
    req.body.match,
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
    value: req.body.beforeCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.beforeMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.beforePoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.beforeDebt,
    validator: 'debt'
  }, {
    required: true,
    value: req.body.afterCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.afterMoney,
    validator: 'money'
  }, {
    required: true,
    value: req.body.afterPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.afterDebt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.beforeCash,
    req.body.beforeMoney,
    req.body.beforePoint,
    req.body.beforeDebt,
    req.body.afterCash,
    req.body.afterMoney,
    req.body.afterPoint,
    req.body.afterDebt,
    req.body.match,
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

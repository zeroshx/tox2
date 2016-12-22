var validator = require('./validator.js');
var Model = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/user.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
    req.query.site,
    req.query.distributor,
    req.query.state,
    req.query.level,
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
    value: req.body.uid,
    validator: 'uid'
  }, {
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.password,
    validator: 'password'
  }, {
    required: false,
    value: req.body.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.recommander,
    validator: 'recommander'
  }, {
    required: true,
    value: req.body.state,
    validator: 'userState'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.distributor,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.level,
    validator: 'level'
  }, {
    required: false,
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: false,
    value: req.body.money,
    validator: 'money'
  }, {
    required: false,
    value: req.body.point,
    validator: 'point'
  }, {
    required: false,
    value: req.body.debt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'userMemo'
  }, {
    required: false,
    value: req.body.accountHolder,
    validator: 'holder'
  }, {
    required: false,
    value: req.body.accountBank,
    validator: 'accountBank'
  }, {
    required: false,
    value: req.body.accountNumber,
    validator: 'accountNumber'
  }, {
    required: false,
    value: req.body.accountPin,
    validator: 'accountPin'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.uid,
    req.body.nick,
    req.body.password,
    req.body.phone,
    req.body.cash,
    req.body.money,
    req.body.point,
    req.body.debt,
    req.body.level,
    req.body.state,
    req.body.site,
    req.body.distributor,
    req.body.memo,
    req.body.accountHolder,
    req.body.accountBank,
    req.body.accountNumber,
    req.body.accountPin,
    req.body.recommander,
    req.hostname,
    req.ip,
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
    value: req.body.password,
    validator: 'password'
  }, {
    required: false,
    value: req.body.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.recommander,
    validator: 'recommander'
  }, {
    required: true,
    value: req.body.state,
    validator: 'userState'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.distributor,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.level,
    validator: 'level'
  }, {
    required: false,
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: false,
    value: req.body.money,
    validator: 'money'
  }, {
    required: false,
    value: req.body.point,
    validator: 'point'
  }, {
    required: false,
    value: req.body.debt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'userMemo'
  }, {
    required: false,
    value: req.body.accountHolder,
    validator: 'holder'
  }, {
    required: false,
    value: req.body.accountBank,
    validator: 'accountBank'
  }, {
    required: false,
    value: req.body.accountNumber,
    validator: 'accountNumber'
  }, {
    required: false,
    value: req.body.accountPin,
    validator: 'accountPin'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.password,
    req.body.phone,
    req.body.cash,
    req.body.money,
    req.body.point,
    req.body.debt,
    req.body.level,
    req.body.state,
    req.body.site,
    req.body.distributor,
    req.body.memo,
    req.body.accountHolder,
    req.body.accountBank,
    req.body.accountNumber,
    req.body.accountPin,
    req.body.recommander,
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
  Model.Delete(req.params.id, function(err, msg, doc) {
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

exports.Me = function(req, res) {
  Model.Me(req.session.auth.id, function(err, msg, doc) {
    if (err) { // internal error
      nodemailer(root + ':Me', JSON.stringify(err));
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

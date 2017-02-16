var validator = require('../validator.js');
var Model = require('mongoose').model('Withdrawal');
var UserModel = require('mongoose').model('User');
var nodemailer = require('../../init/nodemailer.js');
var capi = require('../common.js');

var root = 'controller/withdrawal.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
    req.query.site,
    req.query.distributor,
    req.query.state,
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

exports.CustomerList = function(req, res) {
  var auth = capi.GetAuthSession(req);
  Model.CustomerList(
    req.query.page,
    req.query.pageSize,
    auth.uid,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':CustomerList', JSON.stringify(err));
        return res.sendStatus(500);
      } if (msg) { // exception control
        return res.json({
          count: 0,
          docs: []
        });
      }
      return res.json(doc);
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
    value: req.body.holder,
    validator: 'holder'
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
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.state,
    validator: 'financeState'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.uid,
    req.body.nick,
    req.body.holder,
    req.body.site,
    req.body.distributor,
    req.body.cash,
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

exports.CustomerCreate = function(req, res) {

  var auth = capi.GetAuthSession(req);
  UserModel.Me(auth.id, function(err, rep, doc) {
    if (err) { // internal error
      nodemailer(root + ':CustomerCreate:UserModel.Me', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (rep) {
      return res.sendStatus(500);
    }

    var rep = validator.run([{
      required: true,
      value: req.body.cash,
      validator: 'cash'
    }]);

    if (rep) return res.json({
      failure: rep.msg
    });

    Model.Create(
      doc.uid,
      doc.nick,
      doc.holder,
      doc.site,
      doc.distributor,
      req.body.cash,
      '신청',
      function(err, msg, doc) {
        if (err) { // internal error
          nodemailer(root + ':CustomerCreate:Model.Create', JSON.stringify(err));
          return res.sendStatus(500);
        } else if (msg) { // exception control
          return res.json({
            failure: msg
          });
        } else {
          return res.json(doc);
        }
      });
  });
};

exports.Update = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.holder,
    validator: 'holder'
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
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.state,
    validator: 'financeState'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.nick,
    req.body.holder,
    req.body.site,
    req.body.distributor,
    req.body.cash,
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

exports.Accept = function(req, res) {
  Model.Accept(
    req.params.id,
    '승인',
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Accept', JSON.stringify(err));
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

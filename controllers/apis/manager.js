var validator = require('../validator.js');
var Model = require('mongoose').model('Manager');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/manager.js';

exports.List = function(req, res) {
  Model.List(
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
    value: req.body.bonusPhone,
    validator: 'money'
  }, {
    required: true,
    value: req.body.bonusEmail,
    validator: 'money'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  console.log('Create');

  Model.Create(
    req.body.bonusPhone,
    req.body.bonusEmail,
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
    value: req.body.bonusPhone,
    validator: 'money'
  }, {
    required: true,
    value: req.body.bonusEmail,
    validator: 'money'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.bonusPhone,
    req.body.bonusEmail,
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

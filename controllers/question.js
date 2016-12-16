var validator = require('./validator.js');
var Model = require('mongoose').model('Question');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/question.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
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

exports.Create = function(req, res) {

  var msg = validator.run([{
    required: true,
    value: req.body.style,
    validator: 'style'
  }, {
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.content,
    validator: 'content'
  }, {
    required: false,
    value: req.body.answer,
    validator: 'answer'
  }, {
    required: true,
    value: req.body.state,
    validator: 'questionState'
  }]);

  if (msg) return res.json({
    failure: msg
  });

  Model.Create(
    req.body.style,
    req.body.nick,
    req.body.site,
    req.body.title,
    req.body.content,
    req.body.answer,
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

  var msg = validator.run([{
    required: false,
    value: req.body.answer,
    validator: 'answer'
  }, {
    required: true,
    value: req.body.state,
    validator: 'questionState'
  }]);

  if (msg) return res.json({
    failure: msg
  });

  if (req.body.answer) {
    req.body.state = '완료';
  }

  Model.Update(
    req.params.id,
    req.body.answer,
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

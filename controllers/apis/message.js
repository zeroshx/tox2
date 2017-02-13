var validator = require('../validator.js');
var Model = require('mongoose').model('Message');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/message.js';

exports.List = function(req, res) {
  Model.List(
    req.query.page,
    req.query.pageSize,
    req.query.searchFilter,
    req.query.searchKeyword,
    req.query.check,
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
      value: req.body.sender,
      validator: 'nick'
    }, {
      required: true,
      value: req.body.receiver,
      validator: 'nick'
    }, {
      required: false,
      value: req.body.title,
      validator: 'title'
    }, {
      required: false,
      value: req.body.content,
      validator: 'content'
    }
    // {
    //     required: false,
    //     value: req.body.check,
    //     validator: 'memo'
    // }
  ]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.sender,
    req.body.receiver,
    req.body.title,
    req.body.content,
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
      required: false,
      value: req.body.title,
      validator: 'title'
    }, {
      required: false,
      value: req.body.content,
      validator: 'content'
    }
    // {
    //     required: false,
    //     value: req.body.check,
    //     validator: 'memo'
    // }
  ]);

  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.title,
    req.body.content,
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

exports.Check = function(req, res) {

  Model.Check(
    req.params.id,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Check', JSON.stringify(err));
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
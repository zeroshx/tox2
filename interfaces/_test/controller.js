var response = require('../response.handler.js');
var Model = require('mongoose').model('User');

exports.Get = (req, res) => {
  response.Status(req, res, 200);
};

exports.Post = (req, res) => {
  response.Status(req, res, 200);
};

exports.Update = (req, res) => {
  response.Status(req, res, 200);
};

exports.Delete = (req, res) => {
  response.Status(req, res, 200);
};

var validator = require('../validation.handler.js');
var capi = require('../common.api.js');
var session = require('../session.handler.js');
var response = require('../response.handler.js');

exports.CustomerApp = function(req, res) {
  res.render('customer/index');
};

var validator = require('./validator.js');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/admin.js';

exports.AdminApp = function(req, res) {
  var moment = new Date();
  req.session.admin = {
    location: 'admin-app',
    date: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
  };
  res.render('admin');
};

exports.AdminMenu = function(req, res) {
  // if(req.session.admin) {
  //   if(req.session.admin.config === 'admin') {
  //     return res.redirect('/admin');
  //   }
  // }
  return res.render('admin-menu');
};

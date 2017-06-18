var validator = require('../validation.handler.js');

exports.AdminApp = (req, res) => {
  var moment = new Date();
  req.session.admin = {
    location: 'admin-app',
    date: moment.toLocaleDateString() + ' ' + moment.toLocaleTimeString()
  };
  res.render('admin2/index');
};

exports.AdminMenu = (req, res) => {
  // if(req.session.admin) {
  //   if(req.session.admin.config === 'admin') {
  //     return res.redirect('/admin');
  //   }
  // }
  res.render('admin.menu/index');
};

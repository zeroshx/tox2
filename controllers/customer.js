var validator = require('./validator.js');
var nodemailer = require('../init/nodemailer.js');
var capi = require('./common.js');
var validator = require('./validator.js');
var UserModel = require('mongoose').model('User');
var SiteModel = require('mongoose').model('Site');
var ManagerModel = require('mongoose').model('Manager');
var capi = require('./common.js');

var root = 'controller/customer.js';

exports.CustomerConfig = function(req, res) {

  new Promise(function(resolve, reject) {

    var auth = capi.GetAuthSession(req);
    UserModel.Me(auth.id, function(err, rep, doc) {
      if (err) { // internal error
        return reject(function() {
          nodemailer(root + ':CustomerConfig:UserModel.Me', JSON.stringify(err));
          res.redirect('/error');
        });
      }
      if (rep) { // exception control
        return reject(function() {
          capi.DestroyAuthSession(req, function() {
            res.redirect('/');
          });
        });
      }
      if (!doc.site || !doc.nick || !doc.level || !doc.state) {
        var legacy = {
          auth: auth
        };
        return resolve(legacy);
      }
      return reject(function() {
        res.redirect('/customer');
      });
    });

  }).then(function(legacy) {
    return new Promise(function(resolve, reject) {

      SiteModel.ListAll(function(err, rep, docs) {
        if (err) { // internal error
          return reject(function() {
            nodemailer(root + ':CustomerConfig:SiteModel.ListAll', JSON.stringify(err));
            res.redirect('/error');
          });
        }
        if (rep) { // exception control
          return reject(function() {
            capi.DestroyAuthSession(req, function() {
              res.redirect('/');
            });
          });
        }
        legacy.siteList = docs.docs;
        return resolve(legacy);
      });

    });
  }).then(function(legacy) {
    return new Promise(function(resolve, reject) {

      ManagerModel.List(function(err, rep, data) {
        if (err) { // internal error
          return reject(function() {
            nodemailer(root + ':CustomerConfig:ManagerModel.List', JSON.stringify(err));
            res.redirect('/error');
          });
        }
        if (!data) {
          return reject(function() {
            res.redirect('/error');
          });
        }

        legacy.bonusEmail = capi.Number2Currency(data.docs[0].bonus.email);
        legacy.bonusPhone = capi.Number2Currency(data.docs[0].bonus.phone);

        return res.render('customer-config', {
          siteList: legacy.siteList,
          bonusEmail: legacy.bonusEmail,
          bonusPhone: legacy.bonusPhone,
          uid: legacy.auth.uid,
          _csrf: req.csrfToken()
        });
      });

    });
  }).catch(function(callback) {
    return callback();
  });
};

exports.SubmitCustomerConfig = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.email,
    validator: 'email'
  }, {
    required: false,
    value: req.body.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.recommander,
    validator: 'recommander'
  }]);

  if (rep) return res.json({
    failure: rep.msg,
    errInput: rep.validator
  });

  new Promise(function(resolve, reject) {

    var auth = capi.GetAuthSession(req);
    SiteModel.findOne({
        name: req.body.site
      },
      function(err, doc) {
        if (err) { // internal error
          return reject(function() {
            nodemailer(root + ':SubmitCustomerConfig:SiteModel.findOne', JSON.stringify(err));
            res.redirect('/error');
          });
        }
        if (!doc) {
          return reject(function() {
            res.json({
              failure: '선택하신 서버가 옳바르지 않습니다. 새로고침(F5) 후에 다시 선택해주세요.'
            });
          });
        }
        if (doc.state === '정지') {
          return reject(function() {
            res.json({
              failure: '이용이 정지된 서버를 선택하였습니다. 새로고침(F5) 후에 다시 선택해주세요.'
            });
          });
        }
        var legacy = {
          site: doc,
          auth: auth
        };
        return resolve(legacy);
      });

  }).then(function(legacy) {
    return new Promise(function(resolve, reject) {

      ManagerModel.List(function(err, rep, data) {
        if (err) { // internal error
          return reject(function() {
            nodemailer(root + ':SubmitCustomerConfig:ManagerModel.List', JSON.stringify(err));
            res.redirect('/error');
          });
        }
        if (!data) {
          return reject(function() {
            res.json({
              failure: '일시적인 장애가 발생하였습니다. 잠시 후에 다시 시도바랍니다.'
            });
          });
        }

        var money = Number(legacy.site.config.money);
        if (req.body.phone) {
          money += Number(data.docs[0].bonus.phone);
        }
        if (req.body.email) {
          money += Number(data.docs[0].bonus.email);
        }
        legacy.money = money;
        return resolve(legacy);
      });

    });
  }).then(function(legacy) {
    return new Promise(function(resolve, reject) {

      UserModel.UpdateConfig(
        legacy.auth.id,
        req.body.nick,
        req.body.phone,
        req.body.email,
        legacy.site.config.cash,
        legacy.money,
        legacy.site.config.point,
        legacy.site.config.level,
        /*state*/'일반',
        req.body.site,
        req.body.recommander,
        function(err, rep, data) {
          if (err) { // internal error
            return reject(function() {
              nodemailer(root + ':SubmitCustomerConfig:UserModel.UpdateConfig', JSON.stringify(err));
              res.redirect('/error');
            });
          }
          if (rep) {
            return reject(function() {
              res.json({
                failure: rep
              });
            });
          }

          return resolve(legacy);
        });

    });
  }).then(function(legacy) {
    return new Promise(function(resolve, reject) {

      SiteModel.ModifyHeadcount(
        req.body.site,
        1,
        function(err, rep, data) {
          if (err) { // internal error
            return reject(function() {
              nodemailer(root + ':SubmitCustomerConfig:UserModel.IncreaseHeadcount', JSON.stringify(err));
              res.redirect('/error');
            });
          }
          if (rep) {
            return reject(function() {
              res.json({
                failure: rep
              });
            });
          }
          return res.json({
            ok: 'ok'
          });
        });

    });
  }).catch(function(callback) {
    return callback();
  });

};

exports.CheckNick = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  UserModel.CheckNick(req.body.nick, function(err, rep, doc) {
    if (err) { // internal error
      nodemailer(root + ':CheckNick:UserModel.CheckNick', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (doc) {
      return res.json({
        duplicated: true
      });
    }
    return res.json({
      duplicated: false
    });
  });
};

exports.CustomerApp = function(req, res) {
  res.render('customer');
};

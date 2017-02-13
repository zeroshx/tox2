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
  var auth = capi.GetAuthSession(req);
  UserModel.Me(auth.id,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':CustomerConfig', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (rep) { // exception control
        return capi.DestroyAuthSession(req, function() {
          res.redirect('/');
        });
      } else {
        if (!doc.site || !doc.nick || !doc.level || !doc.state) {
          SiteModel.ListAll(function(err2, rep2, doc2) {
            if (err) { // internal error
              nodemailer(root + ':CustomerConfig', JSON.stringify(err));
              return res.sendStatus(500);
            } else if (rep) { // exception control
              return capi.DestroyAuthSession(req, function() {
                res.redirect('/');
              });
            } else {
              return res.render('customer-config', {
                siteList: doc2.docs,
                bonusEmail: capi.Number2Currency(20000),
                bonusPhone: capi.Number2Currency(30000),
                uid: auth.uid,
                _csrf: req.csrfToken()
              });
            }
          });
        } else {
          return res.redirect('/customer');
        }
      }
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

  SiteModel.GetSiteWithName(
    req.body.site,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':GetSiteWithName', JSON.stringify(err));
        return res.sendStatus(500);
      }
      if (!doc) {
        return res.json({
          failure: '선택하신 서버가 옳바르지 않습니다. 새로고침(F5) 후에 다시 선택해주세요.'
        });
      }
      if (doc.state === '정지') {
        return res.json({
          failure: '이용이 정지된 서버를 선택하였습니다. 새로고침(F5) 후에 다시 선택해주세요.'
        });
      }
      ManagerModel.List(function(err2, rep2, data2) {
        if (err) { // internal error
          nodemailer(root + ':ManagerModel.List', JSON.stringify(err));
          return res.sendStatus(500);
        }
        if (!data2.docs[0]) {
          return res.json({
            failure: '일시적인 장애가 발생했습니다. 잠시 후에 다시 시도해주세요.'
          });
        }

        var auth = capi.GetAuthSession(req);
        var money = Number(doc.config.money);
        if(req.body.phone) {
          money += Number(data2.docs[0].bonus.phone);
        }
        if(req.body.email) {
          money += Number(data2.docs[0].bonus.email);
        }
        
        UserModel.UpdateConfig(
          auth.id,
          req.body.nick,
          req.body.phone,
          req.body.email,
          doc.config.cash,
          money,
          doc.config.point,
          doc.config.level,
          '일반',
          req.body.site,
          req.body.recommander,
          function(err, rep, data) {
            if (err) { // internal error
              nodemailer(root + ':UserModel.UpdateConfig', JSON.stringify(err));
              return res.sendStatus(500);
            }
            if(rep) {
              return res.json({
                failure: rep
              });
            }
            return res.json({
              ok: 'ok'
            });
          });
      });
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
      nodemailer(root + ':CustomerConfig', JSON.stringify(err));
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
  res.send('customer app');
};

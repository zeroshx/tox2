var validator = require('./validator.js');
var UserModel = require('mongoose').model('User');
var QuestionModel = require('mongoose').model('Question');
var IPBlockModel = require('mongoose').model('IPBlock');
var UserHistoryModel = require('mongoose').model('UserHistory');
var BlacklistModel = require('mongoose').model('Blacklist');
var nodemailer = require('../init/nodemailer.js');
var ipaddr = require('ipaddr.js');
var capi = require('./common.js');

var root = 'controller/index.js';

function GetUserIP(originIP) {
  var ip = null;
  if (ipaddr.IPv4.isValid(originIP)) {
    ip = originIP;
  } else if (ipaddr.IPv6.isValid(originIP)) {
    var ipv6 = ipaddr.parse(originIP);
    if (ipv6.isIPv4MappedAddress()) {
      ip = ipv6.toIPv4Address().toString();
    } else {
      ip = ipv6.toString();
    }
  }
  return ip;
};

exports.Index = function(req, res) {
  return res.render('index', {
    csrfToken: req.csrfToken(),
    message: null
  });
};

exports.Signup = function(req, res) {
  res.render('signup', {
    csrfToken: req.csrfToken(),
    message: null,
    uid: null,
    nick: null,
    password: null,
    confirm: null,
    errorInput: null
  });
};

exports.HandleSignup = function(req, res, next) {

  if (req.body.password !== req.body.confirm) {
    return res.render('signup', {
      csrfToken: req.csrfToken(),
      message: '비밀번호가 정확하게 입력되지 않았습니다.',
      uid: req.body.uid,
      nick: req.body.nick,
      password: null,
      confirm: null,
      errorInput: 'password'
    });
  }

  req.body.uid = req.body.uid.toLowerCase();

  var rep = validator.run([{
    required: true,
    value: req.body.uid,
    validator: 'uid'
  }, {
    required: true,
    value: req.body.password,
    validator: 'password'
  }]);

  if (rep) return res.render('signup', {
    csrfToken: req.csrfToken(),
    message: rep.msg,
    uid: req.body.uid,
    password: rep.validator === 'password' ? null : req.body.password,
    confirm: rep.validator === 'password' ? null : req.body.confirm,
    errorInput: rep.validator
  });

  var ip = GetUserIP(req.ip);

  UserModel.Create(
    req.body.uid,
    undefined,
    req.body.password,
    undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined,
    req.hostname,
    ip,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':Create', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (rep) { // exception control
        return res.render('signup', {
          csrfToken: req.csrfToken(),
          message: rep.msg,
          uid: req.body.uid,
          password: req.body.password,
          confirm: req.body.confirm,
          errorInput: rep.element
        });
      } else {
        capi.SetAuthSession(req, doc);
        next();
      }
    });
};

exports.HandleLogin = function(req, res, next) {

  req.body.uid = req.body.uid.toLowerCase();

  var rep = validator.run([{
    required: true,
    value: req.body.uid,
    validator: 'uid'
  }, {
    required: true,
    value: req.body.password,
    validator: 'password'
  }]);

  if (rep) {
    return res.render('index', {
      csrfToken: req.csrfToken(),
      message: rep.msg,
      uid: req.body.uid,
      errorInput: rep.validator
    });
  }

  var ip = GetUserIP(req.ip);

  UserModel.Login(
    req.body.uid,
    req.body.password,
    req.hostname,
    ip,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':Login', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (rep) { // exception control

        var state = '';
        if (rep.element === 'uid') {
          state = '아이디 틀림';
        } else if (rep.element === 'password') {
          state = '비밀번호 틀림';
        }

        UserHistoryModel.Create(
          rep.nick,
          rep.site,
          req.hostname,
          ip,
          state,
          function(err2, rep2, doc2) {
            if (err) { // internal error
              nodemailer(root + ':Login:Create', JSON.stringify(err));
              return res.sendStatus(500);
            }

            return res.render('index', {
              csrfToken: req.csrfToken(),
              message: rep.msg,
              uid: req.body.uid,
              errorInput: rep.element,
            });
          });

      } else {

        UserHistoryModel.Create(
          doc.nick,
          doc.site,
          req.hostname,
          ip,
          '로그인 완료',
          function(err2, rep2, doc2) {
            if (err) { // internal error
              nodemailer(root + ':Login:Create', JSON.stringify(err));
              return res.sendStatus(500);
            }
            capi.SetAuthSession(req, doc);
            return next();
          });
      }
    });
};

exports.RequestVisitorQuestion = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.email,
    validator: 'email'
  }, {
    required: true,
    value: req.body.description,
    validator: 'content'
  }]);

  if (rep) {
    return res.json({
      failure: rep.msg
    });
  }

  QuestionModel.Create(
    /*style*/
    '비회원',
    /*nick*/
    undefined,
    /*site*/
    undefined,
    /*title*/
    '비회원 문의',
    /*content*/
    req.body.description,
    /*answer*/
    undefined,
    /*state*/
    '등록',
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':Login', JSON.stringify(err));
        return res.sendStatus(500);
      } else {
        return res.json(doc);
      }
    });
};

exports.Logout = function(req, res) {
  capi.DestroyAuthSession(req, function() {
    res.redirect('/');
  });
};

exports.SeparateUserRoute = function(req, res, next) {
  var auth = capi.GetAuthSession(req);
  if (auth) {
    if (auth.state === '관리자' || auth.state === '운영자') {
      return res.redirect('/admin/menu');
    }
    return res.redirect('/customer/config');
  }
  return next();
};

exports.CheckBlockIP = function(req, res, next) {
  var ip = GetUserIP(req.ip);
  IPBlockModel.findOne({
    ip: ip
  }, function(err, doc) {
    if (err) {
      nodemailer(root + ':CheckBlockIP', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (doc) {
      return res.send('귀하의 아이피 주소는 차단되었습니다.');
    } else {
      return next();
    }
  });
};

exports.CheckBlacklist = function(req, res, next) {
  var auth = capi.GetAuthSession(req);
  BlacklistModel.findOne({
    nick: auth.nick
  }, function(err, doc) {
    if (err) {
      nodemailer(root + ':CheckBlacklist', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (doc) {
      auth.blacklist = true;
    }
    return next();
  });
};

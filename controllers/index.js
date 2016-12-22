var validator = require('./validator.js');
var UserModel = require('mongoose').model('User');
var QuestionModel = require('mongoose').model('Question');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/index.js';

exports.Index = function(req, res) {
  res.render('index', {
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

exports.HandleSignup = function(req, res) {

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
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.password,
    validator: 'password'
  }]);

  if (rep) return res.render('signup', {
    csrfToken: req.csrfToken(),
    message: rep.msg,
    uid: req.body.uid,
    nick: req.body.nick,
    password: rep.validator === 'password' ? null : req.body.password,
    confirm: rep.validator === 'password' ? null : req.body.confirm,
    errorInput: rep.validator
  });

  UserModel.Create(
    req.body.uid,
    req.body.nick,
    req.body.password,
    null, null, null, null, null,
    null, null, null, null, null,
    null, null, null, null, null,
    req.hostname,
    req.ip,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':Create', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (rep) { // exception control
        return res.render('signup', {
          csrfToken: req.csrfToken(),
          message: rep.msg,
          uid: req.body.uid,
          nick: req.body.nick,
          password: req.body.password,
          confirm: req.body.confirm,
          errorInput: rep.element
        });
      } else {
        //save session
        req.session.auth = {
          id: doc._id,
          uid: doc.uid,
          state: doc.state
        };
        return res.redirect('/usersetting');
      }
    });
};

exports.HandleLogin = function(req, res) {

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

  if (rep) return res.render('index', {
    csrfToken: req.csrfToken(),
    message: rep.msg,
    uid: req.body.uid,
    errorInput: rep.validator
  });

  UserModel.Login(
    req.body.uid,
    req.body.password,
    req.hostname,
    req.ip,
    function(err, rep, doc) {
      if (err) { // internal error
        nodemailer(root + ':Login', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (rep) { // exception control
        return res.render('index', {
          csrfToken: req.csrfToken(),
          message: rep.msg,
          uid: req.body.uid,
          errorInput: rep.element,
        });
      } else {
        //save session
        req.session.auth = {
          id: doc._id,
          uid: doc.uid,
          state: doc.state
        };
        // if (doc.site === null) {
        //   return res.redirect('/usersetting');
        // }
        // return res.redirect('/main');
        return res.redirect('/');
      }
    });
};

exports.RequestGuestService = function(req, res) {

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
    null,
    /*site*/
    null,
    /*title*/
    '비회원 문의',
    /*content*/
    req.body.description,
    /*answer*/
    null,
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
  req.session.destroy();
  res.redirect('/');
};

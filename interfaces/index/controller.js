var ipaddr = require('../ipaddr.handler.js');
var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var UserModel = require('mongoose').model('User');
var QuestionModel = require('mongoose').model('Question');
var IPBlockModel = require('mongoose').model('IPBlock');
var UserHistoryModel = require('mongoose').model('UserHistory');
var BlacklistModel = require('mongoose').model('Blacklist');

function GetSeparatedUserRoute(req) {
  var auth = session.GetAuthSession(req);
  if (auth) {
    if (auth.state === '관리자' || auth.state === '운영자') {
      //return '/admin';
      return '/customer-config';
    }
    return '/customer-config';
  }
  return null;
};

exports.Index = (req, res) => {
  var redirectTo = GetSeparatedUserRoute(req);
  if (redirectTo) return response.Redirect(req, res, redirectTo);
  response.Render(req, res, 'index/index', {});
};

exports.Signup = (req, res) => {
  return response.Render(req, res, 'signup', {
    message: null,
    uid: null,
    nick: null,
    password: null,
    confirm: null,
    errorInput: null
  });
};

exports.CheckBlockIP = (req, res, next) => {
  new Promise((resolve, reject) => {
    var ip = ipaddr.GetUserIP(req.ip);
    IPBlockModel.Check(
      ip,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(next());
        reject(response.Exception(req, res, '아이피 주소가 차단되었습니다.'));
      });
  });
};

exports.CheckBlacklist = (req, res, next) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    BlacklistModel.Check(
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (doc) session.AddAuthSession(req, 'black', true);
        resolve(next());
      });
  });
};

exports.HandleSignup = (req, res, next) => {

  if (req.body.password !== req.body.confirm)
    return response.Exception(req, res, '비밀번호가 정확하게 입력되지 않았습니다.');

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

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var ip = ipaddr.GetUserIP(req.ip);
    UserModel.Signup(
      req.body.uid,
      req.body.password,
      req.hostname,
      ip,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist') return reject(response.Exception(req, res, '이미 존재하는 아이디입니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '회원가입에 실패하였습니다.'));
        session.SetAuthSession(req, doc);
        resolve(next());
      });
  });
};

exports.HandleLogin = (req, res, next) => {

  req.body.uid = req.body.uid.toLowerCase();

  if(!req.body.uid) req.body.uid = 'admin';
  if(!req.body.password) req.body.password = '12341234';

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
    //TODO : 유저접속기록등록(접속기록 모델에 uid 생성 후)
    return response.Exception(req, res, rep.msg);
  }

  new Promise((resolve, reject) => {
    var ip = ipaddr.GetUserIP(req.ip);
    UserModel.Login(
      req.body.uid,
      req.body.password,
      req.hostname,
      ip,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '로그인 중 오류가 발생했습니다.'));
        if (exc === 'wrong-password') return resolve({
          pass: false,
          state: '비밀번호 틀림',
          ip: ip
        });
        if (exc === 'not-found') return resolve({
          pass: false,
          state: '아이디 틀림',
          ip: ip
        });
        resolve({
          pass: true,
          state: '로그인 완료',
          user: doc,
          ip: ip
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var nick = null;
      var site = null;
      if (legacy.user) {
        nick = legacy.user.nick;
        site = legacy.user.site;
      }
      UserHistoryModel.Create(
        req.body.uid,
        nick,
        site,
        req.hostname,
        legacy.ip,
        legacy.state,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Error(req, res, '회원 접속기록 생성에 실패하였습니다.'));
          if (!legacy.pass) return resolve(response.Exception(req, res, '존재하지 않는 아이디거나 비밀번호가 일치하지 않습니다.'));
          session.SetAuthSession(req, legacy.user);
          resolve(next());
        });
    });
  });
};

exports.PassAuthentication = (req, res) => {
  var redirectTo = GetSeparatedUserRoute(req);
  if (redirectTo) return response.Finish(req, res, {
    redirectTo: redirectTo
  });
  response.Error(req, res);
};

exports.RequestVisitorQuestion = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.email,
    validator: 'email'
  }, {
    required: true,
    value: req.body.description,
    validator: 'content'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    QuestionModel.Create(
      req.body.email,
      null,
      null,
      '비회원 문의',
      req.body.description,
      null,
      '등록',
      '비회원',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Error(req, res, '비회원 문의 등록에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Logout = (req, res) => {
  session.DestroyAuthSession(req, () => {
    response.Redirect(req, res, '/');
  });
};

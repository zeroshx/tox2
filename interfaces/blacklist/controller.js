var validator = require('../validation.handler.js');
var response = require('../response.handler.js');
var session = require('../session.handler.js');
var capi = require('../common.api.js');

var Model = require('mongoose').model('Blacklist');
var UserModel = require('mongoose').model('User');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = function(req, res) {

  var v = [{
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }];

  if (req.body.item.type === '아이디') {
    v.push({
      required: true,
      value: req.body.item.target,
      validator: 'uid'
    });
  } else if (req.body.item.type === '닉네임') {
    v.push({
      required: true,
      value: req.body.item.target,
      validator: 'nick'
    });
  } else {
    return response.Exception(req, res, '등록 형식은 아이디 또는 닉네임 중에 하나입니다.');
  }

  var rep = validator.run(v);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    if (req.body.item.type === '아이디') {
      UserModel.OneUid(
        req.body.item.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    } else {
      UserModel.OneNick(
        req.body.item.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    }
  }).then(legacy => {
    var auth = session.GetAuthSession(req);
    req.body.item.uid = legacy.user.uid;
    req.body.item.nick = legacy.user.nick;
    req.body.item.site = legacy.user.site;
    Model.Create(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return response.Error(req, res, err);
        if (exc === 'failure') return response.Exception(req, res, '문서 생성에 실패하였습니다.');
        if (exc === 'exist') return response.Exception(req, res, '이미 등록된 회원입니다.');
        response.Status(req, res, 200);
      });
  });
};

exports.Update = function(req, res) {

  var rep = validator.run([{
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Update(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Delete = function(req, res) {
  new Promise((resolve, reject) => {
    Model.Delete(
      req.params.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 삭제에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

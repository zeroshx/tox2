var ipaddr = require('../ipaddr.handler.js');
var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('User');
var AssetReportModel = require('mongoose').model('AssetReport');

var root = 'controller/user.js';

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.site,
      req.query.distributor,
      req.query.userLevel,
      req.query.userState,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.uid,
    validator: 'uid'
  }, {
    required: true,
    value: req.body.item.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.item.password,
    validator: 'password'
  }, {
    required: true,
    value: req.body.item.state,
    validator: 'userState'
  }, {
    required: true,
    value: req.body.item.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.item.level,
    validator: 'level'
  }, {
    required: false,
    value: req.body.item.account.holder,
    validator: 'holder'
  }, {
    required: false,
    value: req.body.item.account.bank,
    validator: 'accountBank'
  }, {
    required: false,
    value: req.body.item.account.number,
    validator: 'accountNumber'
  }, {
    required: false,
    value: req.body.item.account.pin,
    validator: 'accountPin'
  }, {
    required: false,
    value: req.body.item.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.item.email,
    validator: 'email'
  }, {
    required: false,
    value: req.body.item.recommander,
    validator: 'recommander'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  req.body.item.domain = req.hostname;
  req.body.item.ip = ipaddr.GetUserIP(req.ip);

  console.log(req.body.item);

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist-uid') return reject(response.Exception(req, res, '이미 존재하는 아이디입니다.'));
        if (exc === 'exist-nick') return reject(response.Exception(req, res, '이미 존재하는 닉네임입니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Update = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.item.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.item.password,
    validator: 'password'
  }, {
    required: true,
    value: req.body.item.state,
    validator: 'userState'
  }, {
    required: true,
    value: req.body.item.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.item.level,
    validator: 'level'
  }, {
    required: false,
    value: req.body.item.account.holder,
    validator: 'holder'
  }, {
    required: false,
    value: req.body.item.account.bank,
    validator: 'accountBank'
  }, {
    required: false,
    value: req.body.item.account.number,
    validator: 'accountNumber'
  }, {
    required: false,
    value: req.body.item.account.pin,
    validator: 'accountPin'
  }, {
    required: false,
    value: req.body.item.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.item.email,
    validator: 'email'
  }, {
    required: false,
    value: req.body.item.recommander,
    validator: 'recommander'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {

    Model.Update(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Delete = (req, res) => {
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

exports.Me = function(req, res) {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Me(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
        session.SetAuthSession(req, doc);
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Details = function(req, res) {

  var v = [];
  if(req.query.mode === 'UID') {
    v.push({
      required: true,
      value: req.query.target,
      validator: 'uid'
    });
  } else if (req.query.mode === 'NICK') {
    v.push({
      required: true,
      value: req.query.target,
      validator: 'nick'
    });
  }  else {
    response.Exception(req, res, '인식할 수 없는 요청입니다.');
  }

  var rep = validator.run(v);
  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    if (req.query.mode === 'UID') {
      Model.OneUid(
        req.query.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    } else if (req.query.mode === 'NICK') {
      Model.OneNick(
        req.query.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    }
  });
};

exports.Session = function(req, res) {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    if (auth.uid) {
      return resolve(response.Status(req, res, 200));
    }
    reject(response.Status(req, res, 400));
  });
};

exports.Money = function(req, res) {

  var v = [];
  if(req.body.mode === 'UID') {
    v.push({
      required: true,
      value: req.body.target,
      validator: 'uid'
    });
  } else if (req.body.mode === 'NICK') {
    v.push({
      required: true,
      value: req.body.target,
      validator: 'nick'
    });
  }  else {
    return  response.Exception(req, res, '인식할 수 없는 요청입니다.');
  }

  var rep = validator.run(v);
  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    if (req.body.mode === 'UID') {
      Model.OneUid(
        req.body.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    } else if (req.body.mode === 'NICK') {
      Model.OneNick(
        req.body.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    } else {
      reject(response.Exception(req, res, '인식할 수 없는 요청입니다.'));
    }
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyMoney(
        legacy.user._id,
        req.body.type === 'cash' ? req.body.amount : 0,
        req.body.type === 'chip' ? req.body.amount : 0,
        req.body.type === 'point' ? req.body.amount : 0,
        req.body.type === 'debt' ? req.body.amount : 0,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '금액 수정에 실패하였습니다.'));
          if (exc === 'not-number') return reject(response.Exception(req, res, '처리할 수 없는 파라미터입니다.'));
          legacy.afterUser = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    var auth = session.GetAuthSession(req);
    AssetReportModel.Create({
        uid: legacy.user.uid,
        nick: legacy.user.nick,
        site: legacy.user.site,
        before: {
          cash: legacy.user.cash,
          chip: legacy.user.chip,
          point: legacy.user.point,
          debt: legacy.user.debt
        },
        after: {
          cash: legacy.afterUser.cash,
          chip: legacy.afterUser.chip,
          point: legacy.afterUser.point,
          debt: legacy.afterUser.debt
        },
        match: null,
        memo: '관리자 수정 (' + auth.uid + ')'
      },
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '금액 수정에 실패하였습니다.'));
        response.Status(req, res, 200);
      });
  });
};

exports.Memo = function(req, res) {

  var v = [];
  if(req.body.mode === 'UID') {
    v.push({
      required: true,
      value: req.body.target,
      validator: 'uid'
    });
  } else if (req.body.mode === 'NICK') {
    v.push({
      required: true,
      value: req.body.target,
      validator: 'nick'
    });
  }  else {
    response.Exception(req, res, '인식할 수 없는 요청입니다.');
  }

  var rep = validator.run(v);
  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    if (req.body.mode === 'UID') {
      Model.OneUid(
        req.body.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    } else if (req.body.mode === 'NICK') {
      Model.OneNick(
        req.body.target,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          resolve({
            user: doc
          });
        });
    } else {
      reject(response.Exception(req, res, '인식할 수 없는 요청입니다.'));
    }
  }).then(legacy => {
    Model.ModifyMemo(
      legacy.user._id,
      req.body.memo,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '메모 수정에 실패하였습니다.'));
        response.Status(req, res, 200);
      });
  });
};

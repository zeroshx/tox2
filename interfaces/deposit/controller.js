var session = require('../session.handler.js');
var response = require('../response.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Deposit');
var UserModel = require('mongoose').model('User');
var AssetReportModel = require('mongoose').model('AssetReport');
var ManagerModel = require('mongoose').model('Manager');
var Loger = require('mongoose').model('Loger');

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
      req.query.assetState,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve({
          list: doc
        });
      });
  }).then(legacy => {
    ManagerModel.ResetDepositCase((err, exc, doc) => {
      if (err) return response.Error(req, res, err);
      response.Finish(req, res, legacy.list);
    });
  });
};

exports.Create = (req, res) => {

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
    value: req.body.holder,
    validator: 'holder'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.distributor,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.state,
    validator: 'financeState'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.uid,
      req.body.nick,
      req.body.holder,
      req.body.site,
      req.body.distributor,
      req.body.cash,
      req.body.state,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};


exports.Update = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.holder,
    validator: 'holder'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.distributor,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.state,
    validator: 'financeState'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Update(
      req.params.id,
      req.body.nick,
      req.body.holder,
      req.body.site,
      req.body.distributor,
      req.body.cash,
      req.body.state,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};


exports.Accept = (req, res) => {
  new Promise((resolve, reject) => {
    Model.CheckState(
      req.params.id,
      '신청',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문서를 찾을 수 없습니다.'));
        if (exc === 'processed') return reject(response.Exception(req, res, '이미 처리되었습니다.'));
        resolve({
          deposit: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.OneUid(
        legacy.deposit.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원정보를 찾을 수 없습니다.'));
          legacy.user = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var item = {
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
          cash: legacy.user.cash + legacy.deposit.cash,
          chip: legacy.user.chip,
          point: legacy.user.point,
          debt: legacy.user.debt
        },
        match: null,
        memo: '입금'
      };
      AssetReportModel.Create(
        item,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 자산 변동 내역 생성에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.ModifyMoney(
        legacy.user._id,
        legacy.deposit.cash,
        /*chip*/
        0,
        /*point*/
        0,
        /*debt*/
        0,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-number') return reject(response.Exception(req, res, '회원 자산 수정은 숫자만 입력 가능합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 자산 정보 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.ModifyStat(
        legacy.user._id,
        legacy.deposit.cash,
        0,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-number') return reject(response.Exception(req, res, '회원 자산 통계 수정은 숫자만 입력 가능합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 자산 통계 정보 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      Model.ChangeState(
        req.params.id,
        '승인',
        auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '승인 작업에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.Cancel = (req, res) => {
  new Promise((resolve, reject) => {
    Model.CheckState(
      req.params.id,
      '신청',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문서를 찾을 수 없습니다.'));
        if (exc === 'processed') return reject(response.Exception(req, res, '이미 처리되었습니다.'));
        resolve({
          deposit: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      Model.ChangeState(
        req.params.id,
        '취소',
        auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '취소 작업에 실패하였습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.Delete = (req, res) => {
  new Promise((resolve, reject) => {
    Model.Delete(
      req.params.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '삭제 작업에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerList = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerList(
      req.query.page,
      req.query.pageSize,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.cash,
    validator: 'cash'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  if(Number(req.body.cash) <= 0 ) return response.Exception(req, res, '해당 금액은 신청할 수 없습니다.');

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        resolve({
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Create(
        legacy.user.uid,
        legacy.user.nick,
        legacy.user.holder,
        legacy.user.site,
        legacy.user.distributor.name,
        req.body.cash,
        '신청',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '입금 신청에 실패하였습니다.'));
          resolve();
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.IncDepositCase((err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '입금 신청에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Withdrawal');
var UserModel = require('mongoose').model('User');
var AssetReportModel = require('mongoose').model('AssetReport');
var ManagerModel = require('mongoose').model('Manager');

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
    ManagerModel.ResetWithdrawalCase((err, exc, doc) => {
      if (err) return response.Error(req, res, err);
      response.Finish(req, res, legacy.list);
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
    required: false,
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
        if (doc.cash < req.body.cash) return reject(response.Exception(req, res, '보유 금액보다 신청 금액이 클 수 없습니다.'));
        resolve({
          user: doc,
          auth: auth
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
          cash: legacy.user.cash - req.body.cash,
          chip: legacy.user.chip,
          point: legacy.user.point,
          debt: legacy.user.debt
        },
        match: null,
        memo: '출금'
      };
      AssetReportModel.Create(
        item,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 자산 변경 내역 생성에 실패하였습니다.'));
          legacy.assetReport = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.ModifyMoney(
        legacy.user._id, -req.body.cash,
        0,
        0,
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
        0,
        req.body.cash,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-number') return reject(response.Exception(req, res, '회원 자산 통계 수정은 숫자만 입력 가능합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 자산 통계 정보 수정에 실패하였습니다.'));
          resolve(legacy);
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
          if (exc === 'failure') return reject(response.Exception(req, res, '출금 신청에 실패하였습니다.'));
          resolve();
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.IncWithdrawalCase((err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '출금 신청에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.Accept = (req, res) => {
  new Promise((resolve, reject) => {
    Model.CheckAccept(
      req.params.id,
      '신청',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '처리 대상이 존재하지 않습니다.'));
        if (exc === 'processed') return reject(response.Exception(req, res, '이미 처리되었습니다.'));
        return resolve({
          withdrawal: doc
        });
      });
  }).then((legacy) => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      Model.ChangeState(
        req.params.id,
        '승인',
        auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '승인 작업에 실패하였습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.Cancel = (req, res) => {
  new Promise((resolve, reject) => {
    Model.CheckAccept(
      req.params.id,
      '신청',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '처리 대상이 존재하지 않습니다.'));
        if (exc === 'processed') return reject(response.Exception(req, res, '이미 처리되었습니다.'));
        return resolve({
          withdrawal: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.OneUid(
        legacy.withdrawal.uid,
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
          cash: legacy.user.cash + legacy.withdrawal.cash,
          chip: legacy.user.chip,
          point: legacy.user.point,
          debt: legacy.user.debt
        },
        match: null,
        memo: '출금 취소'
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
        legacy.withdrawal.cash,
        0,
        0,
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
        0, -legacy.withdrawal.cash,
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

var validator = require('../validation.handler.js');
var response = require('../response.handler.js');

var Model = require('mongoose').model('AssetReport');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.site,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.ListForUser = (req, res) => {

  new Promise((resolve, reject) => {
    Model.ListForUser(
      req.query.mode,
      req.query.target,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = function(req, res) {

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
    value: req.body.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.beforeCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.beforeMoney,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.beforePoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.beforeDebt,
    validator: 'debt'
  }, {
    required: true,
    value: req.body.afterCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.afterMoney,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.afterPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.afterDebt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var item = {
      uid: req.body.uid,
      nick: req.body.nick,
      site: req.body.site,
      before: {
        cash: req.body.beforeCash,
        chip: req.body.beforeChip,
        point: req.body.beforePoint,
        debt: req.body.beforeDebt
      },
      after: {
        cash: req.body.afterCash,
        chip: req.body.afterChip,
        point: req.body.afterPoint,
        debt: req.body.afterDebt
      },
      match: req.body.match,
      memo: req.body.memo
    };
    Model.Create(
      item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Update = function(req, res) {

  var rep = validator.run([{
    required: true,
    value: req.body.beforeCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.beforeMoney,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.beforePoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.beforeDebt,
    validator: 'debt'
  }, {
    required: true,
    value: req.body.afterCash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.afterMoney,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.afterPoint,
    validator: 'point'
  }, {
    required: true,
    value: req.body.afterDebt,
    validator: 'debt'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  var item = {
    _id: req.params.id,
    before: {
      cash: req.body.beforeCash,
      chip: req.body.beforeChip,
      point: req.body.beforePoint,
      debt: req.body.beforeDebt
    },
    after: {
      cash: req.body.afterCash,
      chip: req.body.afterChip,
      point: req.body.afterPoint,
      debt: req.body.afterDebt
    },
    match: req.body.match,
    memo: req.body.memo
  };

  new Promise((resolve, reject) => {
    Model.Update(
      item,
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

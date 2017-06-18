var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Site');

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

exports.ListAll = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ListAll((err, exc, doc) => {
      if (err) return reject(response.Error(req, res, err));
      resolve(response.Finish(req, res, doc));
    });
  });
};

exports.Create = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.state,
    validator: 'siteState'
  }, {
    required: true,
    value: req.body.item.name,
    validator: 'site'
  }, {
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }, {
    required: true,
    value: req.body.item.config.level,
    validator: 'level'
  }, {
    required: true,
    value: req.body.item.config.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.item.config.chip,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.item.config.point,
    validator: 'point'
  }, {
    required: true,
    value: req.body.item.bonus.win,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.lose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.firstDeposit,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.deposit,
    validator: 'bonus'
  }, {
    required: false,
    value: req.body.item.answer,
    validator: 'siteAnswer'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Create(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름의 사이트가 존재합니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Update = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.state,
    validator: 'siteState'
  }, {
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }, {
    required: true,
    value: req.body.item.config.level,
    validator: 'level'
  }, {
    required: true,
    value: req.body.item.config.cash,
    validator: 'cash'
  }, {
    required: true,
    value: req.body.item.config.chip,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.item.config.point,
    validator: 'point'
  }, {
    required: true,
    value: req.body.item.bonus.win,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.lose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.firstDeposit,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.deposit,
    validator: 'bonus'
  }, {
    required: false,
    value: req.body.item.answer,
    validator: 'siteAnswer'
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
        resolve(response.Status(req, res, 200));
      });
  });
};

var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('SiteLevel');

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

exports.ListAll = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ListAll((err, exc, doc) => {
      if (err) return reject(response.Error(req, res, err));
      resolve(response.Finish(req, res, doc));
    });
  });
};

exports.ListForSite = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ListForSite(
      req.params.site,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.name,
    validator: 'level'
  }, {
    required: true,
    value: req.body.item.site,
    validator: 'site'
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
    value: req.body.item.bonus.charge,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.recommender,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.single.maxBet,
    validator: 'maxBet'
  }, {
    required: true,
    value: req.body.item.single.minBet,
    validator: 'minBet'
  }, {
    required: true,
    value: req.body.item.single.maxRate,
    validator: 'rate'
  }, {
    required: true,
    value: req.body.item.multi.maxBet,
    validator: 'maxBet'
  }, {
    required: true,
    value: req.body.item.multi.minBet,
    validator: 'minBet'
  }, {
    required: true,
    value: req.body.item.multi.maxRate,
    validator: 'rate'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Create(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름의 레벨 정보가 존재합니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Update = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.bonus.win,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.lose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.charge,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.bonus.recommender,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.item.single.maxBet,
    validator: 'maxBet'
  }, {
    required: true,
    value: req.body.item.single.minBet,
    validator: 'minBet'
  }, {
    required: true,
    value: req.body.item.single.maxRate,
    validator: 'rate'
  }, {
    required: true,
    value: req.body.item.multi.maxBet,
    validator: 'maxBet'
  }, {
    required: true,
    value: req.body.item.multi.minBet,
    validator: 'minBet'
  }, {
    required: true,
    value: req.body.item.multi.maxRate,
    validator: 'rate'
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

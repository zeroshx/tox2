var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('DistributorLevel');
var Loger = require('mongoose').model('Loger');

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
    value: req.body.item.name,
    validator: 'level'
  }, {
    required: true,
    value: req.body.item.order,
    validator: 'order'
  }, {
    required: true,
    value: req.body.item.maxHeadcount,
    validator: 'headcount'
  }, {
    required: true,
    value: req.body.item.statusPoint,
    validator: 'statusPoint'
  }, {
    required: true,
    value: req.body.item.requirement,
    validator: 'requirement'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름 또는 동일 등급의 레벨 정보가 존재합니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Update = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.maxHeadcount,
    validator: 'headcount'
  }, {
    required: true,
    value: req.body.item.statusPoint,
    validator: 'statusPoint'
  }, {
    required: true,
    value: req.body.item.requirement,
    validator: 'requirement'
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
        resolve(response.Status(req, res, 200));
      });
  });
};

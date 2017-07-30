var response = require('../response.handler.js');
var session = require('../session.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Loger');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Update = (req, res) => {

  new Promise((resolve, reject) => {
    Model.Update(
      req.body.id
      req.body.memo,
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

var session = require('../session.handler.js');
var response = require('../response.handler.js');

var Model = require('mongoose').model('Todo');

exports.List = (req, res) => {
  new Promise((resolve, reject) => {
    Model.List(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  if (!req.body.item.task) {
    return response.Exception(req, res, '할 일을 입력해주세요.');
  }

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    req.body.item.state = '등록';
    Model.Create(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Update = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    req.body.item.state = '완료';
    Model.Update(
      req.body.item,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '마감 처리에 실패하였습니다.'));
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

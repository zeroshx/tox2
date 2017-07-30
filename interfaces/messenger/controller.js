var session = require('../session.handler.js');
var response = require('../response.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Messenger');

exports.List = (req, res) => {
  new Promise((resolve, reject) => {
    Model.List(
      req.query.room,
      req.query.count,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Create(
      req.body.room,
      req.body.text,
      auth.uid,
      auth.nick,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

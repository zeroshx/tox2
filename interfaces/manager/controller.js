var response = require('../response.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Manager');

exports.One = (req, res) => {
  new Promise((resolve, reject) => {
    Model.One(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '관리자 설정 정보를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Upsert = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.target.signup.bonus.phone,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.target.signup.bonus.email,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.target.distributor.setup.statusPoint,
    validator: 'statusPoint'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Upsert(
      req.body.target.signup.bonus.phone,
      req.body.target.signup.bonus.email,
      req.body.target.distributor.setup.statusPoint,
      req.body.target.distributor.level,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 업서트 작업에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

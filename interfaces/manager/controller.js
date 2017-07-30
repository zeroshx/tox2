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

exports.SignupConfig = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.bonus.phone,
    validator: 'chip'
  }, {
    required: true,
    value: req.body.item.bonus.email,
    validator: 'chip'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.SetSignupConfig(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 저장에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.GetMessengerRoom = (req, res) => {

  new Promise((resolve, reject) => {
    Model.One(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '관리자 설정 정보를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc.messenger));
      });
  });
};

exports.AddMessengerRoom = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.name,
    validator: 'roomName'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.AddMessengerRoom(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 저장에 실패하였습니다.'));
        if (exc === 'exist') return reject(response.Exception(req, res, '이미 존재하는 이름입니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.RemoveMessengerRoom = (req, res) => {
  new Promise((resolve, reject) => {
    Model.RemoveMessengerRoom(
      req.body.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 삭제에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.GetRealtimeNotification = (req, res) => {

  new Promise((resolve, reject) => {
    Model.One(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '관리자 설정 정보를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc.realtime));
      });
  });
};

exports.CheckRealtimeNotification = (req, res) => {

  var callback = (err, exc, doc) => {
    if (err) return response.Error(req, res, err);
    if (exc === 'failure') return response.Exception(req, res, '관리자 설정 정보를 찾을 수 없습니다.');
    response.Status(req, res, 200);
  };

  if (req.body.type === 'deposit') {
    Model.ResetDepositCase(callback);
  } else if (req.body.type === 'withdrawal') {
    Model.ResetWithdrawalCase(callback);
  } else if (req.body.type === 'question') {
    Model.ResetQuestionCase(callback);
  } else {
    return response.Exception(req, res, '적절하지 않은 요청입니다.');
  }
};

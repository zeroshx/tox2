var session = require('../session.handler.js');
var response = require('../response.handler.js');
var validator = require('../validation.handler.js');
var nodemailer = require('../nodemailer.handler.js');

var Model = require('mongoose').model('Question');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.site,
      req.query.questionState,
      req.query.questionStyle,
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
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.content,
    validator: 'content'
  }, {
    required: false,
    value: req.body.answer,
    validator: 'answer'
  }, {
    required: true,
    value: req.body.state,
    validator: 'questionState'
  }, {
    required: true,
    value: req.body.style,
    validator: 'questionStyle'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.uid,
      req.body.nick,
      req.body.site,
      req.body.title,
      req.body.content,
      req.body.answer,
      req.body.state,
      req.body.style,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
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
    value: req.body.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.content,
    validator: 'content'
  }, {
    required: false,
    value: req.body.answer,
    validator: 'answer'
  }, {
    required: true,
    value: req.body.state,
    validator: 'questionState'
  }, {
    required: true,
    value: req.body.style,
    validator: 'questionStyle'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Update(
      req.params.id,
      req.body.nick,
      req.body.site,
      req.body.title,
      req.body.content,
      req.body.answer,
      req.body.state,
      req.body.style,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Answer = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.answer,
    validator: 'answer'
  }]);

  if (rep) return res.json({
    failure: rep.msg
  });

  new Promise((resolve, reject) => {
    Model.CheckAnswer(
      req.body.id,
      '완료',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문의를 찾을 수 없습니다.'));
        if (exc === 'processed') return reject(response.Exception(req, res, '이미 처리된 상태입니다.'));
        resolve({
          question: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      Model.Answer(
        req.body.id,
        req.body.answer,
        auth.uid,
        '완료',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '답변 등록에 실패하였습니다.'));
          legacy.answer = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      if (legacy.question.style === '비회원') {
        nodemailer.SendAnswerEmail(legacy.question.uid, req.body.answer);
      }
      return resolve(response.Finish(req, res, legacy.answer));
    });
  });
};

exports.Postpone = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.One(
      req.body.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '고객 문의를 찾을 수 없습니다.'));
        if (doc.state === '완료') return reject(response.Exception(req, res, '이미 처리가 완료된 문의입니다.'));
        if (doc.state === '처리중') return reject(response.Exception(req, res, '다른 담당자가 처리중입니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Postpone(
        req.body.id,
        legacy.auth.uid,
        '처리중',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '고객 문의 상태 전환에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
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

exports.CustomerList = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerList(
      auth.uid,
      req.query.page,
      req.query.pageSize,
      req.query.state,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerQuestion = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.One(
      req.params.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문의를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.content,
    validator: 'content'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.Create(
      auth.uid,
      auth.nick,
      auth.site,
      req.body.title,
      req.body.content,
      null,
      '등록',
      '회원',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문의 등록에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

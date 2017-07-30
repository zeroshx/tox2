var session = require('../session.handler.js');
var response = require('../response.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Message');
var UserModel = require('mongoose').model('User');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.messageConfirm,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var v = [{
    required: false,
    value: req.body.item.category,
    validator: 'category'
  }, {
    required: false,
    value: req.body.item.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.item.content,
    validator: 'content'
  }]

  var type = null;
  if(req.body.item.category === '회원') {
    if(req.body.item.receiver.uid) {
      type = 'uid';
      v.push({
        required: true,
        value: req.body.item.receiver.uid,
        validator: 'uid'
      });
    } else if(req.body.item.receiver.nick) {
      type = 'nick';
      v.push({
        required: true,
        value: req.body.item.receiver.nick,
        validator: 'nick'
      });
    } else {
      return response.Exception(req, res, '아이디와 닉네임 중에 하나는 필수 입력입니다.');
    }
  } else if (req.body.item.category === '사이트') {
    v.push({
      required: true,
      value: req.body.item.receiver.site,
      validator: 'site'
    });
  } else if (req.body.item.category === '총판') {
    v.push({
      required: true,
      value: req.body.item.receiver.distributor,
      validator: 'distributor'
    });
  }

  var rep = validator.run(v);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    if(req.body.item.category === '회원') {
      if(type === 'uid') {
        UserModel.OneUid(
          req.body.item.receiver.uid,
          (err, exc, doc) => {
            if (err) return reject(response.Error(req, res, err));
            if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
            resolve({
              user: doc
            });
          });
      } else {
        UserModel.OneNick(
          req.body.item.receiver.nick,
          (err, exc, doc) => {
            if (err) return reject(response.Error(req, res, err));
            if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
            resolve({
              user: doc
            });
          });
      }
    } else {
      resolve();
    }
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      var item = {
        category: req.body.item.category,
        sender: {
          uid: auth.uid,
          nick: auth.nick
        },
        title: req.body.item.title,
        content: req.body.item.content,
        confirm: '안읽음'
      }
      if(item.category === '사이트') {
        item.receiver = {
          site: req.body.item.receiver.site
        }
      } else if(item.category === '총판') {
        item.receiver = {
          distributor: req.body.item.receiver.distributor
        }
      } else if(item.category === '회원') {
        item.receiver = {
          uid: legacy.user.uid,
          nick: legacy.user.nick
        }
      }
      Model.Create(
        item,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.Update = (req, res) => {

  var rep = validator.run([{
    required: false,
    value: req.body.title,
    validator: 'title'
  }, {
    required: false,
    value: req.body.content,
    validator: 'content'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Update(
      req.params.id,
      req.body.title,
      req.body.content,
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
        if (exc) return reject(response.Exception(req, res, '문서 삭제에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerList = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerList(
      auth.site,
      auth.distributor,
      auth.uid,
      req.query.page,
      req.query.pageSize,
      req.query.type,
      req.query.check,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerMessage = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.One(
      req.params.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 쪽지를 찾을 수 없습니다.'));
        if (doc.category === '전체') return resolve();
        if (doc.category === '사이트' && auth.site === doc.receiver.site) return resolve();
        if (doc.category === '총판' && auth.distributor === doc.receiver.distributor) return resolve();
        if (doc.category === '회원' && auth.uid === doc.receiver.uid) return resolve();
        reject(response.Finish(req, res, doc));
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Check(
        req.params.id,
        '읽음',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '쪽지 수신 확인에 실패하였습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};
exports.CustomerCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: true,
    value: req.body.content,
    validator: 'content'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.OneNick(
      req.body.nick,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        resolve({
          auth: auth,
          receiver: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var item = {
        category: '회원',
        sender: {
          uid: legacy.auth.uid,
          nick: legacy.auth.nick
        },
        receiver: {
          uid: legacy.receiver.uid,
          nick: legacy.receiver.nick
        },
        title: req.body.title,
        content: req.body.content,
        confirm: '안읽음'
      };
      Model.Create(
        item,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '쪽지 보내기에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.NewReceivedMessage = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.NewReceivedList(
      auth.uid,
      '안읽음',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.NewMessage = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.NewReceivedList(
      auth.uid,
      '안읽음',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve({
          auth: auth,
          receivedCount: doc.count
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.NewSentList(
        legacy.auth.uid,
        '안읽음',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          resolve(response.Finish(req, res, {
            sentCount: doc.count,
            receivedCount: legacy.receivedCount
          }));
        });
    });
  });
};

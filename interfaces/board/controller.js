var session = require('../session.handler.js');
var response = require('../response.handler.js');
var ipaddr = require('../ipaddr.handler.js');
var validator = require('../validation.handler.js');
var capi = require('../common.api.js');

var Model = require('mongoose').model('Board');
var UserModel = require('mongoose').model('User');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.site,
      req.query.boardForm,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.One = (req, res) => {

  new Promise((resolve, reject) => {
    Model.One(
      req.query.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '게시글을 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.ReplyList = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ReplyList(
      req.query.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var auth = session.GetAuthSession(req);
  req.body.item.uid = auth.uid;

  var v = [{
    required: true,
    value: req.body.item.title,
    validator: 'title'
  }];

  if (req.body.item.writerType === '가상') {
    v.push({
      required: true,
      value: req.body.item.nick,
      validator: 'nick'
    });
    v.push({
      required: false,
      value: req.body.item.site,
      validator: 'site'
    });
    v.push({
      required: false,
      value: req.body.item.level,
      validator: 'level'
    });
  } else {
    req.body.item.nick = auth.nick;
    req.body.item.level = '운영자';
    req.body.item.site = '운영자';
  }

  if (!req.body.item.top) {
    v.push({
      required: true,
      value: req.body.item.sort,
      validator: 'sort'
    });
  }

  var rep = validator.run(v);
  if (rep) return response.Exception(req, res, rep.msg);

  req.body.item.ip = ipaddr.GetUserIP(req.ip);
  req.body.item.form = '글';

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.Update = (req, res) => {

  var v = [{
    required: true,
    value: req.body.item.title,
    validator: 'title'
  }];

  if (req.body.item.writerType === '가상') {
    v.push({
      required: true,
      value: req.body.item.nick,
      validator: 'nick'
    });
    v.push({
      required: false,
      value: req.body.item.site,
      validator: 'site'
    });
    v.push({
      required: false,
      value: req.body.item.level,
      validator: 'level'
    });
  }

  if (!req.body.item.top) {
    v.push({
      required: true,
      value: req.body.item.sort,
      validator: 'sort'
    });
  }

  var rep = validator.run(v);
  if (rep) return response.Exception(req, res, rep.msg);

  req.body.item.ip = ipaddr.GetUserIP(req.ip);
  req.body.item.form = '글';

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.One(
      req.body.item._id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문서를 찾을 수 없습니다.'));
        if (doc.uid !== auth.uid) return reject(response.Exception(req, res, '수정 권한이 없습니다.'));
        resolve({auth: auth});
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Update(
        req.body.item,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.ShowToggle = (req, res) => {

  new Promise((resolve, reject) => {
    Model.One(
      req.body.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 문서를 찾을 수 없습니다.'));
        resolve({writing: doc});
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyShow(
        req.body.id,
        !legacy.writing.show,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.CreateReply = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.reply.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.reply.level,
    validator: 'level'
  }, {
    required: true,
    value: req.body.reply.content,
    validator: 'boardContent'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  req.body.reply.ip = ipaddr.GetUserIP(req.ip);
  req.body.reply.form = '댓글';
  req.body.reply.show = true;

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.reply,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '댓글 생성에 실패하였습니다.'));
        resolve({
          reply: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ReplyPush(
        req.body.pid,
        legacy.reply._id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '댓글 추가 작업에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  })
};

exports.Delete = (req, res) => {
  new Promise((resolve, reject) => {
    Model.Delete(
      req.params.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.DeleteReply = (req, res) => {
  new Promise((resolve, reject) => {
    Model.Delete(
      req.body.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 삭제에 실패하였습니다.'));
        resolve();
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ReplyPop(
        req.body.pid,
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '댓글 제거에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};









exports.CustomerList = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.CustomerList(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      '전체', // req.query.site,
      req.query.sort,
      '글',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerWriting = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.ModifyHitCount(
      req.params.id,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
        if (exc === 'failure') return reject(response.Exception(req, res, '조회수 수정에 실패하였습니다.'));
        resolve();
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.CustomerOne(
        req.params.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글이 존재하지 않습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.CustomerCreateReply = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.content,
    validator: 'replyContent'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
      var ip = ipaddr.GetUserIP(req.ip);
      var auth = session.GetAuthSession(req);
      Model.Create(
        auth.uid,
        auth.nick,
        auth.level,
        auth.site,
        null,
        '댓글',
        null,
        req.body.content,
        ip,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '댓글 생성에 실패하였습니다.'));
          resolve({
            reply: doc
          });
        });
    }).then(legacy => {
      return new Promise((resolve, reject) => {
        Model.ReplyPush(
          req.body.pid,
          legacy.reply._id,
          (err, exc, doc) => {
            if (err) return reject(response.Error(req, res, err));
            if (exc === 'failure') return reject(response.Exception(req, res, '댓글 추가 작업에 실패하였습니다.'));
            resolve();
          });
      });
    })
    .then(legacy => {
      return new Promise((resolve, reject) => {
        Model.CustomerOne(
          req.body.writingId,
          (err, exc, doc) => {
            if (err) return reject(response.Error(req, res, err));
            if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
            resolve(response.Finish(req, res, doc));
          });
      });
    });
};

exports.CustomerCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: true,
    value: req.body.sort,
    validator: 'sort'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var ip = ipaddr.GetUserIP(req.ip);
    var auth = session.GetAuthSession(req);
    Model.Create(
      auth.uid,
      auth.nick,
      auth.level,
      auth.site,
      req.body.sort,
      '글',
      req.body.title,
      req.body.content,
      ip,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '게시글 등록에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerDelete = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerDelete(
      req.params.id,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '게시글 삭제에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.CustomerOpinion = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.opinion,
    validator: 'boardOpinion'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      Model.ModifyOpinion(
        req.body.id,
        auth.uid,
        req.body.opinion,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
          if (exc === 'precessed') return reject(response.Exception(req, res, '이미 게시글을 평가하였습니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '게시글 평가에 실패하였습니다.'));
          resolve();
        });
    })
    .then(legacy => {
      return new Promise((resolve, reject) => {
        Model.CustomerOne(
          req.body.id,
          (err, exc, doc) => {
            if (err) return reject(response.Error(req, res, err));
            if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
            resolve(response.Finish(req, res, doc));
          });
      });
    });
};









exports.DistributorList = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다. 새로고침(F5) 후에 다시 이용 바랍니다.'));
        resolve({
          distributor: doc.distributor
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.CustomerList(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        '전체', // req.query.site,
        req.query.sort + ':' + legacy.distributor.name,
        '글',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.DistributorWriting = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다. 새로고침(F5) 후에 다시 이용 바랍니다.'));
        resolve({
          auth: auth,
          distributor: doc.distributor
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHitCount(
        req.params.id,
        legacy.auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '조회수 수정에 실패하였습니다.'));
          resolve();
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.CustomerOne(
        req.params.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글이 존재하지 않습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.DistributorCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.title,
    validator: 'title'
  }, {
    required: true,
    value: req.body.sort,
    validator: 'sort'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다. 새로고침(F5) 후에 다시 이용 바랍니다.'));
        resolve({
          auth: auth,
          distributor: doc.distributor
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var ip = ipaddr.GetUserIP(req.ip);
      Model.Create(
        legacy.auth.uid,
        legacy.auth.nick,
        legacy.auth.level,
        legacy.auth.site,
        req.body.sort + ':' + legacy.distributor.name,
        '글',
        req.body.title,
        req.body.content,
        ip,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '게시글 등록에 실패하였습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.DistributorCreateReply = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.content,
    validator: 'replyContent'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다. 새로고침(F5) 후에 다시 이용 바랍니다.'));
        resolve({
          auth: auth,
          distributor: doc.distributor
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var ip = ipaddr.GetUserIP(req.ip);
      Model.Create(
        legacy.auth.uid,
        legacy.auth.nick,
        legacy.auth.level,
        legacy.auth.site,
        null,
        '댓글',
        null,
        req.body.content,
        ip,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '댓글 생성에 실패하였습니다.'));
          legacy.reply = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ReplyPush(
        req.body.pid,
        legacy.reply._id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '댓글 등록에 실패하였습니다.'));
          resolve();
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.CustomerOne(
        req.body.writingId,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.DistributorOpinion = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.opinion,
    validator: 'boardOpinion'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다. 새로고침(F5) 후에 다시 이용 바랍니다.'));
        resolve({
          auth: auth,
          distributor: doc.distributor
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyOpinion(
        req.body.id,
        legacy.auth.uid,
        req.body.opinion,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
          if (exc === 'precessed') return reject(response.Exception(req, res, '이미 게시글을 평가하였습니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '게시글 평가에 실패하였습니다.'));
          resolve();
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.CustomerOne(
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '해당 게시글을 찾을 수 없습니다.'));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

var session = require('../session.handler.js');
var response = require('../response.handler.js');
var validator = require('../validation.handler.js');
var capi = require('../common.api.js');

var Model = require('mongoose').model('Distributor');
var ManagerModel = require('mongoose').model('Manager');
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
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.ListAll = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ListAll(
      (err, exc, doc) => {
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

exports.CustomerListForSite = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerListForSite(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      auth.site,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Config = (req, res) => {
  new Promise((resolve, reject) => {
    ManagerModel.GetDistributorSetupConfig(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '총판 설정 정보를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CustomerDistributor = (req, res) => {

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if(!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다.'));
        resolve({
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.OneName(
        legacy.user.site,
        legacy.user.distributor.name,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 정보를 찾을 수 없습니다.'));
          legacy.distributor = doc;
          resolve(legacy);
        });
    });
  })
  .then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetDistributorLevelConfig((err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '총판 레벨 설정 정보를 찾을 수 없습니다.'));
        resolve(response.Finish(req, res, {
          levelInfo: doc,
          distributor: legacy.distributor
        }));
      });
    });
  });
};

exports.CustomerDistributorMember = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if(!capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '가입된 총판이 없습니다.'));
        resolve({
          user: doc
        });
      });
  })
  .then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.DistributorMember(
        req.query.page,
        req.query.pageSize,
        legacy.user.distributor.name,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          resolve(response.Finish(req, res, doc));
        });
    });
  });
};

exports.Create = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.name,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.item.site,
    validator: 'site'
  }, {
    required: true,
    value: req.body.item.manager.uid,
    validator: 'uid'
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
    value: req.body.item.joinStyle,
    validator: 'joinStyle'
  }, {
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    UserModel.OneUid(
      req.body.item.manager.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        resolve({
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      req.body.item.manager.nick = legacy.user.nick;
      var auth = session.GetAuthSession(req);
      Model.Create(
        req.body.item,
        auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름의 총판이 존재합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
          legacy.distributor = doc;
          legacy.auth = auth;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetDistributorLevelConfig(
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 설정 정보를 찾을 수 없습니다.'));
          legacy.config = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.SetDistributorExtra(
        legacy.distributor._id,
        legacy.config[0].name,
        legacy.config[0].statusPoint,
        0,
        legacy.auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 부가 정보 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        legacy.distributor._id,
        1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원수 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.JoinDistributor(
        legacy.user._id,
        legacy.distributor.name,
        '총판장',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입에 실패하였습니다.'));
          session.SetAuthSession(req, doc);
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.CustomerCreate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.name,
    validator: 'distributor'
  }, {
    required: true,
    value: req.body.bonusWin,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.bonusLose,
    validator: 'bonus'
  }, {
    required: true,
    value: req.body.joinStyle,
    validator: 'joinStyle'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    ManagerModel.GetDistributorSetupConfig(
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '총판 설정 정보를 찾을 수 없습니다.'));
        if (doc.statusPoint < req.body.bonusWin + req.body.bonusLose)
          return reject(response.Exception(req, res, '비정상적인 접근입니다.'));
        if (doc.statusPoint > req.body.bonusWin + req.body.bonusLose)
          return reject(response.Exception(req, res, '잔여 스탯 포인트를 모두 사용하세요.'));
        resolve({
          config: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      UserModel.One(
        auth.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보가 없습니다.'));
          if (capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '이미 총판에 가입되어 있습니다.'));
          legacy.auth = auth;
          legacy.user = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Create({
          name: req.body.name,
          site: legacy.auth.site,
          bonus: {
            win: req.body.bonusWin,
            lose: req.body.bonusLose
          },
          manager: {
            uid: legacy.auth.uid,
            nick: legacy.auth.nick
          },
          joinStyle: req.body.joinStyle,
          memo: req.body.memo
        },
        legacy.auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름의 총판이 존재합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 생성에 실패하였습니다.'));
          legacy.distributor = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.SetDistributorExtra(
        legacy.distributor._id,
        1,
        legacy.config.statusPoint,
        0,
        legacy.auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 부가 정보 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        legacy.distributor._id,
        1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원수 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.JoinDistributor(
        legacy.auth.id,
        legacy.distributor.name,
        '총판장',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입에 실패하였습니다.'));
          session.SetAuthSession(req, doc);
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.Update = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.item.manager.uid,
    validator: 'uid'
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
    value: req.body.item.joinStyle,
    validator: 'joinStyle'
  }, {
    required: false,
    value: req.body.item.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    UserModel.OneUid(
      req.body.item.manager.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        resolve({
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      req.body.item.manager.nick = legacy.user.nick;
      var auth = session.GetAuthSession(req);
      Model.Update(
        req.body.item,
        auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
          legacy.distributor = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.DropOutDistributor(
        legacy.user._id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 탈퇴에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.JoinDistributor(
        legacy.user._id,
        legacy.distributor.name,
        '총판장',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });;
};

exports.CustomerUpdate = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.joinStyle,
    validator: 'joinStyle'
  }, {
    required: false,
    value: req.body.memo,
    validator: 'memo'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    Model.CustomerUpdate(
      req.body.pid,
      req.body.joinStyle,
      req.body.memo,
      auth.uid,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '총판 정보 수정에 실패하였습니다.'));
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
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.CheckJoinCondition = (req, res, next) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '이미 총판에 가입되어 있습니다.'));
        resolve({
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetDistributorLevelConfig(
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 레벨 설정 정보를 찾을 수 없습니다.'));
          legacy.levels = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.One(
        req.body.distributor,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 정보를 찾을 수 없습니다.'));
          var level = null;
          for (var i = 0; i < legacy.levels.length; i++) {
            if (legacy.levels[i].name === doc.level) {
              level = legacy.levels[i];
            }
          }
          if (doc.headcount >= level.maxHeadcount) {
            return reject(response.Exception(req, res, '총판 인원수가 최대이므로 가입할 수 없습니다.'));
          }
          if (doc.joinStyle === '비공개') {
            return reject(response.Exception(req, res, '해당 총판은 비공개로 가입할 수 없습니다.'));
          } else if (doc.joinStyle === '자유') {
            req.legacy = {
              distributor: doc
            };
            return reject(next());
          }
          legacy.distributor = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.AddJoinAwaiter(
        legacy.distributor._id,
        legacy.user._id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입 신청에 실패하였습니다.'));
          resolve(response.Finish(req, res, {
            type: 'awaiter',
            success: '가입 신청이 완료되었습니다.'
          }));
        });
    });
  });
};

exports.Join = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.JoinDistributor(
      auth.id,
      req.legacy.distributor.name,
      '일반',
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입에 실패하였습니다.'));
        session.SetAuthSession(req, doc);
        resolve({auth: aut});
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        req.legacy.distributor._id,
        1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 회원수 수정에 실패하였습니다.'));
          resolve(response.Finish(req, res, {
            type: 'member',
            success: '가입 완료되었습니다.'
          }));
        });
    });
  });
};

exports.AwaiterAccept = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (doc.distributor.rank !== '총판장') return reject(response.Exception(req, res, '해당 기능은 총판장만 할 수 있습니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.One(
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
          if (capi.IsValidString(doc.distributor.name)) return reject(response.Exception(req, res, '이미 총판에 가입되어 있습니다.'));
          legacy.user = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetDistributorLevelConfig(
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 레벨 설정 정보를 찾을 수 없습니다.'));
          legacy.levels = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.One(
        req.body.pid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '총판 정보를 찾을 수 없습니다.'));
          var level = null;
          for (var i = 0; i < legacy.levels.length; i++) {
            if (legacy.levels[i].name === doc.level) {
              level = legacy.levels[i];
            }
          }
          if (doc.headcount >= level.maxHeadcount) {
            return reject(response.Exception(req, res, '총판 인원수가 최대이므로 가입할 수 없습니다.'));
          }
          legacy.distributor = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.JoinDistributor(
        req.body.id,
        legacy.distributor.name,
        '일반',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        legacy.distributor._id,
        1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 회원수 수정에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.RemoveJoinAwaiter(
        req.body.pid,
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입 대기자 정보 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.AwaiterReject = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (doc.distributor.rank !== '총판장') return reject(response.Exception(req, res, '해당 기능은 총판장만 할 수 있습니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.RemoveJoinAwaiter(
        req.body.pid,
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입 대기자 정보 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.AwaiterRejectAll = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (doc.distributor.rank !== '총판장') return reject(response.Exception(req, res, '해당 기능은 총판장만 할 수 있습니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.RemoveJoinAwaiterAll(
        req.body.pid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 가입 대기자 정보 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.DropOut = (req, res) => {
  new Promise((resolve, reject) => {
    Model.One(
      req.body.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '총판 정보를 찾을 수 없습니다.'));
        resolve({
          distributor: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      var auth = session.GetAuthSession(req);
      UserModel.One(
        auth.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
          if (legacy.distributor.headcount > 1 && doc.distributor.rank === '총판장') return reject(response.Exception(req, res, '총판장을 다른 회원에게 인계 후에 탈퇴할 수 있습니다.'));
          if (legacy.distributor.name !== doc.distributor.name) return reject(response.Exception(req, res, '비정상적인 접근입니다.'));
          legacy.auth = auth;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.DropOutDistributor(
        legacy.auth.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 탈퇴에 실패하였습니다.'));
          session.SetAuthSession(req, doc);
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        legacy.distributor._id,
        -1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 회원수 수정에 실패하였습니다.'));
          if (doc.headcount > 0) return reject(response.Status(req, res, 200));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Delete(
        legacy.distributor._id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 삭제에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.HandOver = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (doc.distributor.rank !== '총판장') return reject(response.Exception(req, res, '해당 기능은 총판장만 할 수 있습니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.ModifyDistributor(
        req.body.id,
        '총판장',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 총판 정보 수정에 실패하였습니다.'));
          legacy.nextBoss = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.ModifyDistributor(
        legacy.auth.id,
        '일반',
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 총판 정보 수정에 실패하였습니다.'));
          session.SetAuthSession(req, doc);
          legacy.preBoss = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyManager(
        req.body.pid,
        legacy.nextBoss.uid,
        legacy.nextBoss.nick,
        legacy.auth.uid,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판장 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

exports.Expell = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.One(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Exception(req, res, '회원 정보를 찾을 수 없습니다.'));
        if (doc.distributor.rank !== '총판장') return reject(response.Exception(req, res, '해당 기능은 총판장만 할 수 있습니다.'));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.DropOutDistributor(
        req.body.id,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '회원 총판 탈퇴에 실패하였습니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.ModifyHeadcount(
        req.body.pid,
        -1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '총판 회원수 수정에 실패하였습니다.'));
          resolve(response.Status(req, res, 200));
        });
    });
  });
};

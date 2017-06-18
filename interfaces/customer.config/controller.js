var validator = require('../validation.handler.js');
var capi = require('../common.api.js');
var session = require('../session.handler.js');
var response = require('../response.handler.js');

var UserModel = require('mongoose').model('User');
var SiteModel = require('mongoose').model('Site');
var ManagerModel = require('mongoose').model('Manager');

exports.CustomerConfig = (req, res) => {
  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.CheckBasicSetting(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Error(req, res, '회원 기본설정 셋팅을 찾을 수 없습니다.'));
        if (doc) return reject(response.Redirect(req, res, '/customer'));
        resolve({
          auth: auth,
          user: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      SiteModel.ListAll(function(err, exc, doc) {
        if (err) return reject(response.Error(req, res, err));
        legacy.siteList = doc.docs;
        resolve(legacy);
      });
    });
  }).then((legacy) => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetSingupConfig((err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (msg) return reject(response.Error(req, res, msg));
        resolve(response.Render(req, res, 'customer-config/index', {
          siteList: legacy.siteList,
          bonusEmail: capi.Number2Currency(doc.bonus.email),
          bonusPhone: capi.Number2Currency(doc.bonus.phone)
        }));
      });
    });
  });
};

exports.SubmitCustomerConfig = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }, {
    required: true,
    value: req.body.site,
    validator: 'site'
  }, {
    required: false,
    value: req.body.email,
    validator: 'email'
  }, {
    required: false,
    value: req.body.phone,
    validator: 'phone'
  }, {
    required: false,
    value: req.body.recommander,
    validator: 'recommander'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    var auth = session.GetAuthSession(req);
    UserModel.CheckBasicSetting(
      auth.id,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'not-found') return reject(response.Error(req, res, '회원 기본설정 셋팅을 찾을 수 없습니다.'));
        if (doc) return reject(response.Finish(req, res, {
          redirectTo: '/customer'
        }));
        resolve({
          auth: auth
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.CheckNick(
        req.body.nick,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'exist') return reject(response.Exception(req, res, '이미 존재하는 닉네임입니다.'));
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      SiteModel.OneName(
        req.body.site,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Exception(req, res, '선택하신 사이트 정보를 찾을 수 없습니다.'));
          if (doc.state === '정지') return reject(response.Exception(req, res, '선택하신 사이트는 정지되어 이용할 수 없습니다.'));
          legacy.site = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      ManagerModel.GetSingupConfig(
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'not-found') return reject(response.Error(req, res, '회원가입 보너스 정보를 찾을 수 없습니다.'));
          var chip = Number(legacy.site.config.chip);
          if (req.body.phone) {
            chip += Number(doc.bonus.phone);
          }
          if (req.body.email) {
            chip += Number(doc.bonus.email);
          }
          legacy.chip = chip;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      UserModel.UpdateBasicSetting(
        legacy.auth.id,
        req.body.nick,
        req.body.phone,
        req.body.email,
        legacy.site.config.cash,
        legacy.chip,
        legacy.site.config.point,
        0,
        legacy.site.config.level,
        /*state*/
        '일반',
        req.body.site,
        req.body.recommander,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'exist') return reject(response.Error(req, res, '이미 존재하는 닉네임입니다.'));
          if (exc === 'failure') return reject(response.Error(req, res, '회원 기본설정에 실패하였습니다.'));
          legacy.user = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      SiteModel.ModifyHeadcount(
        req.body.site,
        1,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Error(req, res, '사이트 회원수 정보 수정에 실패하였습니다.'));
          session.SetAuthSession(req, legacy.user);
          resolve(response.Finish(req, res, {
            redirectTo: '/customer'
          }));
        });
    });
  });
};

exports.CheckNick = (req, res) => {

  var rep = validator.run([{
    required: true,
    value: req.body.nick,
    validator: 'nick'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    UserModel.CheckNick(
      req.body.nick,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'exist') return reject(response.Exception(req, res, '이미 존재하는 닉네임입니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

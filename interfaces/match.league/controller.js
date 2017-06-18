var fs = require('fs');
var formidable = require('formidable');
var validator = require('../validation.handler.js');
var expressConfig = require('../../configs/express.js');
var response = require('../response.handler.js');

var Model = require('mongoose').model('MatchLeague');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.ListAll = (req, res) => {
  new Promise((resolve, reject) => {
    Model.ListAll((err, exc, doc) => {
      if (err) return reject(response.Error(req, res, err));
      resolve(response.Finish(req, res, doc));
    });
  });
};

exports.Create = (req, res) => {
  new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, body, file) => {
      if (err) return response.Error(req, res, err);
      var rep = validator.run([{
        required: true,
        value: body.name,
        validator: 'league'
      }, {
        required: true,
        value: body.country,
        validator: 'country'
      }]);

      if (rep) return response.Exception(req, res, rep.msg);

      var imgPath = null;
      var tempImgPath = null;
      var targetPath = null;
      var imgExist = false;
      if (file.hasOwnProperty('image')) {
        var fileSize = Number(file.image.size);
        if (fileSize > (300 * 1024)) {
          return response.Exception(req, res, '파일 사이즈가 초과하였습니다.(300KB 제한)');
        }
        tempImgPath = file.image.path;
        var now = new Date();
        imgPath = expressConfig.league_upload_path + now.getTime() + file.image.name;
        targetPath = __dirname + "/../../public" + imgPath;
        imgExist = true;
      }
      resolve({
        body: body,
        imgExist: imgExist,
        imgPath: imgPath,
        tempImgPath: tempImgPath,
        targetPath: targetPath
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Create(
        legacy.body.name,
        legacy.body.country,
        legacy.imgPath,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'exist') return reject(response.Exception(req, res, '동일 이름의 리그가 존재합니다.'));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
          legacy.league = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      if (!legacy.imgExist) return reject(response.Finish(req, res, legacy.league));
      fs.readFile(legacy.tempImgPath, function(err, data) {
        if (err) return reject(response.Error(req, res, err));
        legacy.image = data;
        resolve(legacy);
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      fs.writeFile(legacy.targetPath, legacy.image, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(legacy);
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      fs.unlink(legacy.tempImgPath, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, legacy.league));
      });
    });
  });
};

exports.Update = (req, res) => {
  new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, body, file) => {
      if (err) return response.Error(req, res, err);

      var rep = validator.run([{
        required: true,
        value: body.country,
        validator: 'country'
      }]);

      if (rep) return response.Exception(req, res, rep.msg);

      var imgPath = null;
      var tempImgPath = null;
      var targetPath = null;
      var imgExist = false;
      if (file.hasOwnProperty('image')) {
        var fileSize = Number(file.image.size);
        if (fileSize > (300 * 1024)) {
          return response.Exception(req, res, '파일 사이즈가 초과하였습니다.(300KB 제한)');
        }
        tempImgPath = file.image.path;
        var now = new Date();
        imgPath = expressConfig.league_upload_path + now.getTime() + file.image.name;
        targetPath = __dirname + "/../../public" + imgPath;
        imgExist = true;
      }
      resolve({
        body: body,
        imgExist: imgExist,
        imgPath: imgPath,
        tempImgPath: tempImgPath,
        targetPath: targetPath
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      Model.Update(
        req.params.id,
        legacy.body.country,
        legacy.imgPath,
        (err, exc, doc) => {
          if (err) return reject(response.Error(req, res, err));
          if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
          legacy.league = doc;
          resolve(legacy);
        });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      if (!legacy.league.imagePath) return resolve(legacy);
      var preImgPath = __dirname + "/../../public" + legacy.league.imagePath;
      if (!fs.existsSync(preImgPath)) return resolve(legacy);
      fs.unlink(preImgPath, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(legacy);
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      if (!legacy.imgExist) return reject(response.Finish(req, res, legacy.league));
      fs.readFile(legacy.tempImgPath, function(err, data) {
        if (err) return reject(response.Error(req, res, err));
        legacy.image = data;
        resolve(legacy);
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      fs.writeFile(legacy.targetPath, legacy.image, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(legacy);
      });
    });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      fs.unlink(legacy.tempImgPath, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, legacy.league));
      });
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
        resolve({
          league: doc
        });
      });
  }).then(legacy => {
    return new Promise((resolve, reject) => {
      if (!legacy.league.imagePath) return resolve(response.Finish(req, res, legacy.league));
      var targetPath = __dirname + "/../../public" + legacy.league.imagePath;
      if (!fs.existsSync(targetPath)) return resolve(response.Finish(req, res, legacy.league));
      fs.unlink(targetPath, function(err) {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, legacy.league));
      });
    });
  });
};

var response = require('../response.handler.js');
var validator = require('../validation.handler.js');
var capi = require('../common.api.js');

var Model = require('mongoose').model('Match');

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.matchState,
      req.query.matchKind,
      req.query.date1,
      req.query.date2,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var item = req.body.item;

  if(item.mtype === '스포츠') {
    item.temp = [];
    var l = item.content.length;
    for(i = 0; i < l; i++) {
      if(item.content[i].status === 'HOME' || item.content[i].status === 'AWAY') {
        item.temp.push({
          status: item.content[i].status,
          name: item.content[i].name
        });
      }
    }
  } else if(item.mtype === '버라이어티') {
    item.temp = [];
    var l = item.content.length;
    for(i = 0; i < l; i++) {
      if(item.content[i].status === 'VARIETY') {
        item.temp.push({
          status: item.content[i].status,
          name: item.content[i].name
        });
      }
    }
  }
  item.content = item.temp;

  var rep = validator.run([{
    required: true,
    value: req.body.item.state,
    validator: 'matchState'
  }, {
    required: true,
    value: req.body.item.mtype,
    validator: 'mtype'
  }, {
    required: true,
    value: req.body.item.kind,
    validator: 'kind'
  }, {
    required: true,
    value: req.body.item.league,
    validator: 'league'
  }, {
    required: true,
    value: req.body.item.content,
    validator: 'matchContent'
  }, {
    required: true,
    value: req.body.item.market,
    validator: 'market'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

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

exports.Update = function(req, res) {

  var item = req.body.item;

  if(item.mtype === '스포츠') {
    item.temp = [];
    var l = item.content.length;
    for(i = 0; i < l; i++) {
      if(item.content[i].status === 'HOME' || item.content[i].status === 'AWAY') {
        item.temp.push({
          status: item.content[i].status,
          name: item.content[i].name
        });
      }
    }
  } else if(item.mtype === '버라이어티') {
    item.temp = [];
    var l = item.content.length;
    for(i = 0; i < l; i++) {
      if(item.content[i].status === 'VARIETY') {
        item.temp.push({
          status: item.content[i].status,
          name: item.content[i].name
        });
      }
    }
  }
  item.content = item.temp;

  var rep = validator.run([{
    required: true,
    value: req.body.item.mtype,
    validator: 'mtype'
  }, {
    required: true,
    value: req.body.item.kind,
    validator: 'kind'
  }, {
    required: true,
    value: req.body.item.league,
    validator: 'league'
  }, {
    required: true,
    value: req.body.item.content,
    validator: 'matchContent'
  }, {
    required: true,
    value: req.body.item.market,
    validator: 'market'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Update(
      req.body.item,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
      });
  });
};

exports.State = function(req, res) {

  if(req.body.state === '종료') return response.Exception(req, res, '임의로 \'종료\' 상태로 변경할 수 없습니다.');

  var rep = validator.run([{
    required: true,
    value: req.body.state,
    validator: 'matchState'
  }]);

  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.ModifyState(
      req.body.id,
      req.body.state,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Status(req, res, 200));
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
        resolve(response.Status(req, res, 200));
      });
  });
};

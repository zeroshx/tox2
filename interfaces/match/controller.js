var response = require('../response.handler.js');
var validator = require('../validation.handler.js');

var Model = require('mongoose').model('Match');

function validation(body) {

  var rep = validator.run([{
    required: true,
    value: body.btype,
    validator: 'btype'
  }, {
    required: true,
    value: body.mtype,
    validator: 'mtype'
  }, {
    required: true,
    value: body.state,
    validator: 'matchState'
  }, {
    required: true,
    value: body.schedule,
    validator: 'schedule'
  }, {
    required: true,
    value: body.kind,
    validator: 'kind'
  }, {
    required: true,
    value: body.league,
    validator: 'league'
  }]);

  if (rep) return rep;

  var valueList = [];
  if (body.btype === '2-WAY') {

    valueList = [{
      required: true,
      value: body.homeName,
      validator: 'team'
    }, {
      required: true,
      value: body.homeRate,
      validator: 'rate'
    }, {
      required: true,
      value: body.awayName,
      validator: 'team'
    }, {
      required: true,
      value: body.awayRate,
      validator: 'rate'
    }];

    if (body.mtype === '핸디캡' || body.mtype === '언더오버') {
      valueList.push({
        required: true,
        value: body.offset,
        validator: 'offset'
      });
    } else {
      body.offset = null;
    }

    body.result = null;
    body.homeScore = null;
    body.awayScore = null;
    body.tieRate = null;
    body.varietySubject = null;
    body.varietyOption = null;

    return validator.run(valueList);

  } else if (body.btype === '3-WAY') {

    valueList = [{
      required: true,
      value: body.homeName,
      validator: 'team'
    }, {
      required: true,
      value: body.homeRate,
      validator: 'rate'
    }, {
      required: true,
      value: body.awayName,
      validator: 'team'
    }, {
      required: true,
      value: body.awayRate,
      validator: 'rate'
    }, {
      required: true,
      value: body.tieRate,
      validator: 'rate'
    }];

    body.homeScore = null;
    body.awayScore = null;
    body.result = null;
    body.offset = null;
    body.varietySubject = null;
    body.varietyOption = null;

    return validator.run(valueList);

  } else { // req.body.btype === 'VARIETY'

    valueList = [{
      required: true,
      value: body.varietySubject,
      validator: 'subject'
    }, {
      required: true,
      value: body.varietyOption,
      validator: 'option'
    }];

    body.result = null;
    body.homeName = null;
    body.homeScore = null;
    body.homeRate = null;
    body.tieRate = null;
    body.awayName = null;
    body.awayScore = null;
    body.awayRate = null;
    body.offset = null;

    return validator.run(valueList);
  }
}

exports.List = (req, res) => {

  validator.AdjustPageQuery(req.query, 1, 20);

  new Promise((resolve, reject) => {
    Model.List(
      req.query.page,
      req.query.pageSize,
      req.query.searchFilter,
      req.query.searchKeyword,
      req.query.listMode,
      req.query.state,
      req.query.mtype,
      req.query.kind,
      req.query.league,
      req.query.result,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Create = (req, res) => {

  var rep = validation(req.body);
  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Create(
      req.body.homeName, req.body.homeScore, req.body.homeRate,
      req.body.tieRate,
      req.body.awayName, req.body.awayScore, req.body.awayRate,
      req.body.varietySubject, req.body.varietyOption,
      req.body.offset,
      req.body.state, req.body.btype, req.body.mtype,
      req.body.kind, req.body.league, /*group*/ null,
      req.body.schedule,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 생성에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
      });
  });
};

exports.Update = function(req, res) {

  var rep = validation(req.body);
  if (rep) return response.Exception(req, res, rep.msg);

  new Promise((resolve, reject) => {
    Model.Update(
      req.params.id,
      req.body.homeName, req.body.homeScore, req.body.homeRate,
      req.body.tieRate,
      req.body.awayName, req.body.awayScore, req.body.awayRate,
      req.body.varietySubject, req.body.varietyOption,
      req.body.offset,
      req.body.state, req.body.btype, req.body.mtype,
      req.body.kind, req.body.league, /*group*/ null,
      req.body.schedule,
      (err, exc, doc) => {
        if (err) return reject(response.Error(req, res, err));
        if (exc === 'failure') return reject(response.Exception(req, res, '문서 수정에 실패하였습니다.'));
        resolve(response.Finish(req, res, doc));
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

var validator = require('../validator.js');
var Model = require('mongoose').model('Match');
var nodemailer = require('../../init/nodemailer.js');

var root = 'controller/match.js';

function validation(req) {

  var rep = validator.run([{
    required: true,
    value: req.body.btype,
    validator: 'btype'
  }, {
    required: true,
    value: req.body.mtype,
    validator: 'mtype'
  }, {
    required: true,
    value: req.body.state,
    validator: 'matchState'
  }, {
    required: true,
    value: req.body.schedule,
    validator: 'schedule'
  }, {
    required: true,
    value: req.body.kind,
    validator: 'kind'
  }, {
    required: true,
    value: req.body.league,
    validator: 'league'
  }]);

  if (rep) return rep;

  var valueList = [];
  if (req.body.btype === '2-WAY') {

    valueList = [{
      required: true,
      value: req.body.homeName,
      validator: 'team'
    }, {
      required: true,
      value: req.body.homeRate,
      validator: 'rate'
    }, {
      required: true,
      value: req.body.awayName,
      validator: 'team'
    }, {
      required: true,
      value: req.body.awayRate,
      validator: 'rate'
    }];

    if (req.body.mtype === '핸디캡' || req.body.mtype === '언더오버') {
      valueList.push({
        required: true,
        value: req.body.offset,
        validator: 'offset'
      });
    } else {
      req.body.offset = null;
    }

    req.body.result = null;
    req.body.homeScore = null;
    req.body.awayScore = null;
    req.body.tieRate = null;
    req.body.varietySubject = null;
    req.body.varietyOption = null;

    return validator.run(valueList);

  } else if (req.body.btype === '3-WAY') {

    valueList = [{
      required: true,
      value: req.body.homeName,
      validator: 'team'
    }, {
      required: true,
      value: req.body.homeRate,
      validator: 'rate'
    }, {
      required: true,
      value: req.body.awayName,
      validator: 'team'
    }, {
      required: true,
      value: req.body.awayRate,
      validator: 'rate'
    }, {
      required: true,
      value: req.body.tieRate,
      validator: 'rate'
    }];

    req.body.homeScore = null;
    req.body.awayScore = null;
    req.body.result = null;
    req.body.offset = null;
    req.body.varietySubject = null;
    req.body.varietyOption = null;

    return validator.run(valueList);

  } else { // req.body.btype === 'VARIETY'

    valueList = [{
      required: true,
      value: req.body.varietySubject,
      validator: 'subject'
    }, {
      required: true,
      value: req.body.varietyOption,
      validator: 'option'
    }];

    req.body.result = null;
    req.body.homeName = null;
    req.body.homeScore = null;
    req.body.homeRate = null;
    req.body.tieRate = null;
    req.body.awayName = null;
    req.body.awayScore = null;
    req.body.awayRate = null;
    req.body.offset = null;

    return validator.run(valueList);
  }
}

exports.List = function(req, res) {
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
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':List', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Create = function(req, res) {

  var rep = validation(req);
  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Create(
    req.body.homeName, req.body.homeScore, req.body.homeRate,
    req.body.tieRate,
    req.body.awayName, req.body.awayScore, req.body.awayRate,
    req.body.varietySubject, req.body.varietyOption,
    req.body.offset,
    req.body.state, req.body.btype, req.body.mtype,
    req.body.kind, req.body.league, /*group*/undefined,
    req.body.schedule,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Create', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Update = function(req, res) {

  var rep = validation(req);
  if (rep) return res.json({
    failure: rep.msg
  });

  Model.Update(
    req.params.id,
    req.body.homeName, req.body.homeScore, req.body.homeRate,
    req.body.tieRate,
    req.body.awayName, req.body.awayScore, req.body.awayRate,
    req.body.varietySubject, req.body.varietyOption,
    req.body.offset,
    req.body.state, req.body.btype, req.body.mtype,
    req.body.kind, req.body.league, /*group*/undefined,
    req.body.schedule,
    function(err, msg, doc) {
      if (err) { // internal error
        nodemailer(root + ':Ureate', JSON.stringify(err));
        return res.sendStatus(500);
      } else if (msg) { // exception control
        return res.json({
          failure: msg
        });
      } else {
        return res.json(doc);
      }
    });
};

exports.Delete = function(req, res) {
  Model.Delete(req.params.id, function(err, msg, doc) {
    if (err) { // internal error
      nodemailer(root + ':Delete', JSON.stringify(err));
      return res.sendStatus(500);
    } else if (msg) { // exception control
      return res.json({
        failure: msg
      });
    } else {
      return res.json(doc);
    }
  });
};

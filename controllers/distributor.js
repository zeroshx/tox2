var Distributor = require('mongoose').model('Distributor');
var nodemailer = require('../init/nodemailer.js');

exports.single = function(req, res) {
  Distributor.findOne({
    _id: req.params.distId
  }, function(err, dist) {
    if (err) {
      nodemailer('controller/distributor.js:single', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (dist) {
      return res.json(dist);
    }
    return res.json({
      failure: '존재하지 않는 총판 입니다.'
    });
  });
};

exports.list = function(req, res) {
  Distributor.find(function(err, dists) {
    if (err) {
      nodemailer('controller/distributor.js:list', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.json(dists);
  });
};

exports.create = function(req, res) {
  Distributor.findOne({
    name: req.body.name
  }, function(err, dist) {
    if (err) {
      nodemailer('controller/distributor.js:create', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (dist) {
      return res.json({
        failure: '이미 존재하는 총판 입니다.'
      });
    }
    var newDist = new Distributor();
    newDist.name = req.body.name;
    if (req.body.memo) {
      newDist.memo = req.body.memo;
    }
    newDist.save(function(err) {
      if (err) {
        nodemailer('controller/distributor.js:create', JSON.stringify(err));
        return res.sendStatus(500);
      }
      return res.json(newDist);
    });
  });
};

exports.update = function(req, res) {
  Distributor.findOneAndUpdate({
    _id: req.body._id
  }, {
    $set: {
      memo: req.body.memo
    }
  }, function(err, dist) {
    if (err) {
      nodemailer('controller/distributor.js:update', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};

exports.delete = function(req, res) {
  Distributor.findOneAndRemove({
    _id: req.params.distId
  }, function(err, dist) {
    if (err) {
      nodemailer('controller/distributor.js:delete', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};

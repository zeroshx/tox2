var Site = require('mongoose').model('Site');
var nodemailer = require('../init/nodemailer.js');

exports.single = function(req, res) {
  Site.findOne({
    _id: req.params.siteId
  }, function(err, site) {
    if (err) {
      nodemailer('controller/site.js:single', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (site) {
      return res.json(site);
    } else {
      return res.json({
        failure: '존재하지 않는 사이트입니다.'
      })
    }
  });
};

exports.list = function(req, res) {
  Site.find(function(err, sites) {
    if (err) {
      nodemailer('controller/site.js:list', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.json(sites);
  });
};

exports.create = function(req, res) {
  Site.findOne({
    name: req.body.name
  }, function(err, site) {
    if (err) {
      nodemailer('controller/site.js:create:1', JSON.stringify(err));
      return res.sendStatus(500);
    }
    if (site) {
      return res.json({
        failure: '이미 존재하는 사이트 입니다.'
      });
    }
    var newSite = new Site();
    newSite.name = req.body.name;
    if (req.body.memo) {
      newSite.memo = req.body.memo;
    }
    newSite.save(function(err) {
      if (err) {
        nodemailer('controller/site.js:create:2', JSON.stringify(err));
        return res.sendStatus(500);
      }
      return res.json(newSite);
    });
  });
};

exports.update = function(req, res) {
  Site.findOneAndUpdate({
    _id: req.body._id
  }, {
    $set: {
      memo: req.body.memo
    }
  }, function(err, site) {
    if (err) {
      nodemailer('controller/site.js:update', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};

exports.delete = function(req, res) {
  Site.findOneAndRemove({
    _id: req.params.siteId
  }, function(err, site) {
    if (err) {
      nodemailer('controller/site.js:delete', JSON.stringify(err));
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};

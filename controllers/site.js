var Site = require('mongoose').model('Site');
var nodemailer = require('../init/nodemailer.js');

exports.single = function(req, res) {
    Site.Single(req.params.siteId,
        function(err, msg, site) {
            if (err) { // internal error
                nodemailer('controller/site.js:single', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(site);
            }
        });
};

exports.list = function(req, res) {
    Site.List(function(err, msg, sites) {
        if (err) { // internal error
            nodemailer('controller/site.js:list', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(sites);
        }
    });
};

exports.create = function(req, res) {
    Site.Create(
        req.body.name,
        req.body.memo,
        function(err, msg, site) {
        if (err) { // internal error
            nodemailer('controller/site.js:create', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(site);
        }
    });
};

exports.update = function(req, res) {
    Site.Update(
        req.body._id,
        req.body.memo,
        function(err, msg, site) {
        if (err) { // internal error
            nodemailer('controller/site.js:update', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(site);
        }
    });
};

exports.delete = function(req, res) {
    Site.Delete(
        req.params.siteId,
        function(err, msg, site) {
        if (err) { // internal error
            nodemailer('controller/site.js:delete', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(site);
        }
    });
};

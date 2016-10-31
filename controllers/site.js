var Site = require('mongoose').model('Site');
var nodemailer = require('../init/nodemailer.js');

exports.List = function(req, res) {
    Site.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        function(err, msg, sites) {
            if (err) { // internal error
                nodemailer('controller/site.js:List', JSON.stringify(err));
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

exports.ListAll = function(req, res) {
    Site.ListAll(function(err, msg, sites) {
        if (err) { // internal error
            nodemailer('controller/site.js:List', JSON.stringify(err));
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

exports.Create = function(req, res) {
    Site.Create(
        req.body.name,
        req.body.memo,
        req.body.bonusWin,
        req.body.bonusLose,
        function(err, msg, site) {
            if (err) { // internal error
                nodemailer('controller/site.js:Create', JSON.stringify(err));
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

exports.Update = function(req, res) {
    Site.Update(
        req.params.id,
        req.body.name,
        req.body.memo,
        req.body.bonusWin,
        req.body.bonusLose,
        function(err, msg, site) {
            if (err) { // internal error
                nodemailer('controller/site.js:Update', JSON.stringify(err));
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

exports.Delete = function(req, res) {
    Site.Delete(
        req.params.id,
        function(err, msg, site) {
            if (err) { // internal error
                nodemailer('controller/site.js:Delete', JSON.stringify(err));
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

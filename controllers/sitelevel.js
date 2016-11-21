var Model = require('mongoose').model('SiteLevel');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/sitelevel.js';

exports.List = function(req, res) {
    Model.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
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

exports.ListAll = function(req, res) {
    Model.ListAll(function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':ListAll', JSON.stringify(err));
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


exports.ListForSite = function(req, res) {
    Model.ListForSite(
        req.params.site,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':ListForSite', JSON.stringify(err));
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

    Model.Create(
        req.body.name,
        req.body.bonusWin,
        req.body.bonusLose,
        req.body.bonusCharge,
        req.body.bonusRecommender,
        req.body.singleMaxBet,
        req.body.singleMaxRate,
        req.body.multiMaxBet,
        req.body.multiMaxRate,
        req.body.site,
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

    Model.Update(
        req.params.id,
        req.body.name,
        req.body.bonusWin,
        req.body.bonusLose,
        req.body.bonusCharge,
        req.body.bonusRecommender,
        req.body.singleMaxBet,
        req.body.singleMaxRate,
        req.body.multiMaxBet,
        req.body.multiMaxRate,
        req.body.site,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':Update', JSON.stringify(err));
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
    Model.Delete(
        req.params.id,
        function(err, msg, doc) {
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

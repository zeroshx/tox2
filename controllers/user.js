var Model = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/user.js';

exports.List = function(req, res) {
    Model.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        req.query.site,
        req.query.distributor,
        req.query.state,
        req.query.level,
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
    Model.Create(
        req.body.auth,
        req.body.nick,
        req.body.password,
        req.body.phone,
        req.body.cash,
        req.body.money,
        req.body.point,
        req.body.level,
        req.body.state,
        req.body.site,
        req.body.distributor,
        req.body.memo,
        req.body.accountBank,
        req.body.accountNumber,
        req.body.accountPin,
        req.hostname,
        req.ip,
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
        req.body.auth,
        req.body.nick,
        req.body.password,
        req.body.phone,
        req.body.cash,
        req.body.money,
        req.body.point,
        req.body.level,
        req.body.state,
        req.body.site,
        req.body.distributor,
        req.body.memo,
        req.body.accountBank,
        req.body.accountNumber,
        req.body.accountPin,
        req.body.recommander,
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

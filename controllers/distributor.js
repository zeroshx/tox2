var Distributor = require('mongoose').model('Distributor');
var User = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');


exports.List = function(req, res) {
    Distributor.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        function(err, msg, dists) {
            if (err) { // internal error
                nodemailer('controller/distributor.js:List', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(dists);
            }
        });
};

exports.Create = function(req, res) {

    // 1. find manager
    User.GetUserWithNick(req.body.manager, function(err, msg, user) {
        if (err) { // internal error
            nodemailer('controller/distributor.js:GetUserWithNick', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: '총판관리자 ' + msg
            });
        } else {
            // 2. create
            Distributor.Create(
                user._id,
                user.nick,
                req.body.name,
                req.body.memo,
                req.body.bonusWin,
                req.body.bonusLose,
                function(err, msg, dist) {
                    if (err) { // internal error
                        nodemailer('controller/distributor.js:Create', JSON.stringify(err));
                        return res.sendStatus(500);
                    } else if (msg) { // exception control
                        return res.json({
                            failure: msg
                        });
                    } else {
                        return res.json(dist);
                    }
                });
        }
    });
};

exports.Update = function(req, res) {

    // 1. find manager
    User.GetUserWithNick(req.body.manager, function(err, msg, user) {
        if (err) { // internal error
            nodemailer('controller/distributor.js:GetUserWithNick', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: '총판관리자 ' + msg
            });
        } else {
            // 2. create
            Distributor.Update(
                user._id,
                user.nick,
                req.params.id,
                req.body.name,
                req.body.memo,
                req.body.bonusWin,
                req.body.bonusLose,
                function(err, msg, dist) {
                    if (err) { // internal error
                        nodemailer('controller/distributor.js:Update', JSON.stringify(err));
                        return res.sendStatus(500);
                    } else if (msg) { // exception control
                        return res.json({
                            failure: msg
                        });
                    } else {
                        return res.json(dist);
                    }
                });
        }
    });

};

exports.Delete = function(req, res) {
    Distributor.Delete(
        req.params.id,
        function(err, msg, dist) {
            if (err) { // internal error
                nodemailer('controller/distributor.js:Delete', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(dist);
            }
        });
};

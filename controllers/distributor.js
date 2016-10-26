var Distributor = require('mongoose').model('Distributor');
var User = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');
//
// exports.single = function(req, res) {
//     Distributor.Single(
//         req.params.distId,
//         function(err, msg, dist) {
//             if (err) { // internal error
//                 nodemailer('controller/distritutor.js:single', JSON.stringify(err));
//                 return res.sendStatus(500);
//             } else if (msg) { // exception control
//                 return res.json({
//                     failure: msg
//                 });
//             } else {
//                 return res.json(dist);
//             }
//         });
// };

exports.List = function(req, res) {
    Distributor.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        function(err, msg, sites) {
            if (err) { // internal error
                nodemailer('controller/distributor.js:List', JSON.stringify(err));
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
                user.nick,
                req.body.name,
                req.body.memo,
                req.body.bonusWin,
                req.body.bonusLose,
                function(err, msg, distributor) {
                    if (err) { // internal error
                        nodemailer('controller/distributor.js:Create', JSON.stringify(err));
                        return res.sendStatus(500);
                    } else if (msg) { // exception control
                        return res.json({
                            failure: msg
                        });
                    } else {
                        return res.json(distributor);
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
                user.nick,
                req.params.id,
                req.body.name,
                req.body.memo,
                req.body.bonusWin,
                req.body.bonusLose,
                function(err, msg, distributor) {
                    if (err) { // internal error
                        nodemailer('controller/distributor.js:Update', JSON.stringify(err));
                        return res.sendStatus(500);
                    } else if (msg) { // exception control
                        return res.json({
                            failure: msg
                        });
                    } else {
                        return res.json(distributor);
                    }
                });
        }
    });

};

exports.Delete = function(req, res) {
    Distributor.Delete(
        req.params.id,
        function(err, msg, distributor) {
            if (err) { // internal error
                nodemailer('controller/distributor.js:Delete', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(distributor);
            }
        });
};

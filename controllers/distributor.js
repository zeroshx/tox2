var Distributor = require('mongoose').model('Distributor');
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
    Distributor.Create(
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
};

exports.Update = function(req, res) {
    Distributor.Update(
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

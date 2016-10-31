var Distributor = require('mongoose').model('Distributor');
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

    Distributor.Create(
        req.body.name,
        req.body.site,
        req.body.manager,
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
};

exports.Update = function(req, res) {

    Distributor.Update(
        req.params.id,
        req.body.name,
        req.body.site,
        req.body.manager,
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

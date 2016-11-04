var Model = require('mongoose').model('Match');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/match.js';

exports.List = function(req, res) {
    Model.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
        req.query.listMode,
        req.query.state,
        req.query.mtype,
        req.query.kind,
        req.query.league,
        req.query.result,
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
        req.body.homeName, req.body.homeScore, req.body.homeRate,
        req.body.tieRate,
        req.body.awayName, req.body.awayScore, req.body.awayRate,
        req.body.varietySubject, req.body.varietyOption,
        req.body.offset,
        req.body.state, req.body.btype, req.body.mtype,
        req.body.kind, req.body.league,
        req.body.schedule,
        req.body.result,
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
        req.body.homeName, req.body.homeScore, req.body.homeRate,
        req.body.tieRate,
        req.body.awayName, req.body.awayScore, req.body.awayRate,
        req.body.varietySubject, req.body.varietyOption,
        req.body.offset,
        req.body.state, req.body.btype, req.body.mtype,
        req.body.kind, req.body.league,
        req.body.schedule,
        req.body.result,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':Ureate', JSON.stringify(err));
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

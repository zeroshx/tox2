var Match = require('mongoose').model('Match');
var nodemailer = require('../init/nodemailer.js');

exports.List = function(req, res) {
    Match.List(
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
        function(err, msg, matches) {
            if (err) { // internal error
                nodemailer('controller/match.js:List', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(matches);
            }
        });
};

exports.Create = function(req, res) {
    Match.Create(
        req.body.homeName, req.body.homeScore, req.body.homeRate,
        req.body.tieRate,
        req.body.awayName, req.body.awayScore, req.body.awayRate,
        req.body.varietySubject, req.body.varietyPicks,
        req.body.offset,
        req.body.state, req.body.btype, req.body.mtype,
        req.body.kind, req.body.league,
        req.body.schedule,
        req.body.result,
        function(err, msg, match) {
            if (err) { // internal error
                nodemailer('controller/match.js:Create', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(match);
            }
        });
};

exports.Update = function(req, res) {
    Match.Update(
        req.params.id,
        req.body.homeName, req.body.homeScore, req.body.homeRate,
        req.body.tieRate,
        req.body.awayName, req.body.awayScore, req.body.awayRate,
        req.body.varietySubject, req.body.varietyPicks,
        req.body.offset,
        req.body.state, req.body.btype, req.body.mtype,
        req.body.kind, req.body.league,
        req.body.schedule,
        req.body.result,
        function(err, msg, match) {
            if (err) { // internal error
                nodemailer('controller/match.js:Create', JSON.stringify(err));
                return res.sendStatus(500);
            } else if (msg) { // exception control
                return res.json({
                    failure: msg
                });
            } else {
                return res.json(match);
            }
        });
};

exports.Delete = function(req, res) {
    Match.Delete(req.params.id, function(err, msg, match) {
        if (err) { // internal error
            nodemailer('controller/match.js:Delete', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(match);
        }
    });
};

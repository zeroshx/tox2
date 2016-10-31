var Match = require('mongoose').model('Match');
var nodemailer = require('../init/nodemailer.js');

exports.List = function(req, res) {
    Match.List(
        req.query.page,
        req.query.pageSize,
        req.query.searchFilter,
        req.query.searchKeyword,
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
        req.body.homeName, req.body.homeScore,
        req.body.awayName, req.body.awayScore,
        req.body.homeRate, req.body.drawRate, req.body.awayRate,
        req.body.offset,
        req.body.variety,
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
    res.sendStatus(200);
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

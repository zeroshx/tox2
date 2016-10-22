var Distributor = require('mongoose').model('Distributor');
var nodemailer = require('../init/nodemailer.js');

exports.single = function(req, res) {
    Distributor.Single(
        req.params.distId,
        function(err, msg, dist) {
            if (err) { // internal error
                nodemailer('controller/distritutor.js:single', JSON.stringify(err));
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

exports.list = function(req, res) {
    Distributor.List(
        function(err, msg, dists) {
            if (err) { // internal error
                nodemailer('controller/distritutor.js:list', JSON.stringify(err));
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

exports.create = function(req, res) {
    Distributor.Create(
        req.body.name,
        req.body.memo,
        function(err, msg, dist) {
            if (err) { // internal error
                nodemailer('controller/distritutor.js:create', JSON.stringify(err));
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

exports.update = function(req, res) {
    Distributor.Update(
        req.body._id,
        req.body.memo,
        function(err, msg, dist) {
            if (err) { // internal error
                nodemailer('controller/distritutor.js:update', JSON.stringify(err));
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

exports.delete = function(req, res) {
    Distributor.Delete(
        req.params.distId,
        function(err, msg, dist) {
            if (err) { // internal error
                nodemailer('controller/distritutor.js:delete', JSON.stringify(err));
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

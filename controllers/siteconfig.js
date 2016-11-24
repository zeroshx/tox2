var validator = require('./validator.js');
var Model = require('mongoose').model('SiteConfig');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/siteconfig.js';

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

exports.Create = function(req, res) {

    var msg = validator.run([
        {
            required: true,
            value: req.body.site,
            validator: 'site'
        }, {
            required: true,
            value: req.body.betCancelLimit,
            validator: 'cancelLimit'
        }, {
            required: true,
            value: req.body.betCancelCount,
            validator: 'cancelCount'
        }, {
            required: false,
            value: req.body.kindConfig,
            validator: 'kindConfig'
        }
    ]);

    if (msg) return res.json({
        failure: msg
    });

    Model.Create(
        req.body.site,
        req.body.betCancelLimit,
        req.body.betCancelCount,
        req.body.kindConfig,
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

    var msg = validator.run([
        {
            required: true,
            value: req.body.betCancelLimit,
            validator: 'cancelLimit'
        }, {
            required: true,
            value: req.body.betCancelCount,
            validator: 'cancelCount'
        }, {
            required: false,
            value: req.body.kindConfig,
            validator: 'kindConfig'
        }
    ]);

    if (msg) return res.json({
        failure: msg
    });

    Model.Update(
        req.params.id,
        req.body.betCancelLimit,
        req.body.betCancelCount,
        req.body.kindConfig,
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

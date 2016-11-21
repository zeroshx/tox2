var validator = require('./validator.js');
var Model = require('mongoose').model('Distributor');
var nodemailer = require('../init/nodemailer.js');

var root = 'controller/distributor.js';

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

exports.ListAll = function(req, res) {
    Model.ListAll(function(err, msg, doc) {
        if (err) { // internal error
            nodemailer(root + ':ListAll', JSON.stringify(err));
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

exports.ListForSite = function(req, res) {
    Model.ListForSite(
        req.params.site,
        function(err, msg, doc) {
            if (err) { // internal error
                nodemailer(root + ':ListForSite', JSON.stringify(err));
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

    var msg = validator.run([{
        required: true,
        value: req.body.name,
        validator: 'distributor'
    }, {
        required: true,
        value: req.body.site,
        validator: 'site'
    }, {
        required: true,
        value: req.body.manager,
        validator: 'nick'
    }, {
        required: true,
        value: req.body.bonusWin,
        validator: 'bonus'
    }, {
        required: true,
        value: req.body.bonusLose,
        validator: 'bonus'
    }, {
        required: false,
        value: req.body.memo,
        validator: 'memo'
    }]);

    if (msg) return res.json({
        failure: msg
    });

    Model.Create(
        req.body.name,
        req.body.site,
        req.body.manager,
        req.body.bonusWin,
        req.body.bonusLose,
        req.body.memo,
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

    var msg = validator.run([{
        required: true,
        value: req.body.site,
        validator: 'site'
    }, {
        required: true,
        value: req.body.manager,
        validator: 'nick'
    }, {
        required: true,
        value: req.body.bonusWin,
        validator: 'bonus'
    }, {
        required: true,
        value: req.body.bonusLose,
        validator: 'bonus'
    }, {
        required: false,
        value: req.body.memo,
        validator: 'memo'
    }]);

    if (msg) return res.json({
        failure: msg
    });

    Model.Update(
        req.params.id,
        req.body.site,
        req.body.manager,
        req.body.bonusWin,
        req.body.bonusLose,
        req.body.memo,
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

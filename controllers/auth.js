var User = require('mongoose').model('User');
var nodemailer = require('../init/nodemailer.js');

exports.signup = function(req, res) {
    if (req.session.passport.user.hasOwnProperty('failure')) {
        var fail = req.user;     // req.user has failure message.
        delete req.session.passport;
        delete req.user;
        res.json(fail);
        return;
    }
    res.json(req.user);
};

exports.login = function(req, res) {
    if (req.session.passport.user.hasOwnProperty('failure')) {
        var fail = req.user;    // req.user has failure message.
        delete req.session.passport;
        delete req.user;
        res.json(fail);
        return;
    }
    res.json(req.user);
};

exports.logout = function(req, res) {
    req.logout();
    res.sendStatus(200);
};

exports.alive = function(req, res) {
    if (req.isAuthenticated()) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(500);
    }
};

exports.checkEmail = function(req, res) {
    User.CheckEmail(
        req.body.email,
        function(err, msg) {
        if (err) { // internal error
            nodemailer('controller/user.js:checkEmail', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.sendStatus(200);
        }
    });
};

exports.checkNick = function(req, res) {
    User.CheckNick(
        req.body.nick,
        function(err, msg) {
        if (err) { // internal error
            nodemailer('controller/user.js:checkNick', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.sendStatus(200);
        }
    });
};

exports.me = function(req, res) {
    User.Me(
        req.user._id,
        function(err, msg, me) {
        if (err) { // internal error
            nodemailer('controller/user.js:me', JSON.stringify(err));
            return res.sendStatus(500);
        } else if (msg) { // exception control
            return res.json({
                failure: msg
            });
        } else {
            return res.json(me);
        }
    });
};

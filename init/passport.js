module.exports = function() {
    //Basic Modules
    var nodemailer = require('../init/nodemailer.js');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('mongoose').model('User');

    /*
    PASSPORT MODULE CUSTOM MESSAGING WAY

    step 1. Use "done(null, {failure:'password does not valid.'});"
    instead of "done(null, false);""

    step 2. make express middleware below like
    because delete passport resource.

    function(req, res) {
      if (req.session.passport.user.hasOwnProperty('failure')) {
        var fail = req.user;
        delete req.session.passport;
        delete req.user;
        res.json(fail);
        return;
      }
      res.json(req.user);
    }
    */

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        if (user.hasOwnProperty('failure')) {
            done(null, user);
        } else {
            done(null, user._id);
        }
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id,
            '-password',
            function(err, user) {
                if (err) {
                    nodemailer('init/passport.js:deserializeUser', JSON.stringify(err));
                    return done(err);
                }
                return done(err, user);
            });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.Signup(
                    req.body.email,
                    req.body.nick,
                    req.body.password,
                    req.body.confirm,
                    function(err, res) {
                        if (err && res) {
                            return done(null, {
                                failure: res
                            });
                        } else if (err) {
                            nodemailer('init/passport.js:signup', JSON.stringify(err));
                            return done(err);
                        } else {
                            return done(null, res);
                        }
                    });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
              User.Login(
                  req.body.email,
                  req.body.password,
                  function(err, res) {
                      if (err && res) {
                          return done(null, {
                              failure: res
                          });
                      } else if (err) {
                          nodemailer('init/passport.js:login', JSON.stringify(err));
                          return done(err);
                      } else {
                          return done(null, res);
                      }
                  });
            });
        }));
};

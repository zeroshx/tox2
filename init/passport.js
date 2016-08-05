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
        User.findOne({
          $or: [{
            email: req.body.email
          }, {
            nick: req.body.nick
          }]
        }, function(err, user) {
          if (err) {
            nodemailer('init/passport.js:signup:1', JSON.stringify(err));
            return done(err);
          }
          if (user) {
            if (user.email == req.body.email) {
              return done(null, {
                failure: '이미 존재하는 이메일 입니다.'
              });
            } else if (user.nick == req.body.nick) {
              return done(null, {
                failure: '이미 존재하는 닉네임 입니다.'
              });
            } else {
              return done(null, {
                failure: '이미 존재하는 회원입니다.'
              });
            }
          } else {
            var newUser = new User();
            newUser.site = '57a483ba916cb4742276009e';
            newUser.distributor = '57a483d1916cb4742276009f';
            newUser.email = req.body.email;
            newUser.nick = req.body.nick;
            newUser.password = req.body.password;
            newUser.confirm = req.body.confirm;
            if (newUser.password == newUser.confirm) {
              if (newUser.password.length >= 8 && newUser.password.length <= 30) {
                newUser.generateHash(password, function(err, hash) {
                  if(err) {
                    nodemailer('init/passport.js:signup:2', JSON.stringify(err));
                    return done(err);
                  }
                  newUser.password = hash;
                  newUser.save(function(err) {
                    if (err) {
                      nodemailer('init/passport.js:signup:3', JSON.stringify(err));
                      return done(err);
                    } else {
                      newUser.password = null;
                      return done(null, newUser);
                    }
                  });
                });
              } else {
                return done(null, {
                  failure: '비밀번호가 적절하지 않습니다.'
                });
              }
            } else {
              return done(null, {
                failure: '비밀번호 확인이 정상적이지 않습니다.'
              });
            }
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
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          nodemailer('init/passport.js:login:1', JSON.stringify(err));
          return done(err);
        }
        if (!user) {
          return done(null, {
            failure: '존재하지 않는 이메일 또는 비밀번호가 맞지 않습니다.'
          });
        }
        user.validatePassword(password, function (err, match) {
          if(err) {
            nodemailer('init/passport.js:login:2', JSON.stringify(err));
            return done(err);
          }
          if(!match) {
            return done(null, {
              failure: '존재하지 않는 이메일 또는 비밀번호가 맞지 않습니다.'
            });
          }
          user.login.date = Date.now();
          user.save(function (err, user) {
            if(err) {
              nodemailer('init/passport.js:login:3', JSON.stringify(err));
              return done(err);
            }
            user.password = null;
            return done(null, user);
          });
        });
      });
    }));
};

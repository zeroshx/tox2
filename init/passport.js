module.exports = function() {
  //Basic Modules
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var User = require('mongoose').model('User');

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById({
      _id: id
    }, '-password', function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      console.log(req.body);
      process.nextTick(function() {
        User.findOne({
          email: email
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, 'zeros error');
          } else {
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save(function(err) {
              if (err) {
                console.log(err);
                return done(err);
              } else {
                return done(null, newUser);
              }
            });
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
        if (err)
          return done(err);
        if (!user)
          return done(null, false, 'user not exist.');
        if (!user.validPassword(password))
          return done(null, false, 'password not valid.');
        return done(null, user);
      });
    }));
};

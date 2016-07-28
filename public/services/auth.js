var app = angular.module(ApplicationName);
app.factory('Auth', function($resource) {
  return {
    signup: function(user, callback, errorback) {
      $resource('/auth/signup').create(user,
        function(user) {
          return callback(user);
        },
        function(err) {
          return errorback(err);
        });
    },

    login: function(user, callback, errorback) {
      $resource('/auth/login').auth(user,
        function(user) {
          return callback(user);
        },
        function(err) {
          return errorback(err);
        });
    },

    logout: function(callback, errorback) {
      $resource('/auth/logout').get(
        function(res) {
          return callback();
        },
        function(err) {
          return errorback(err);
        });
    },

    isAlive: function(callback, errorback) {
      $resource('/auth/alive').get(
        function(res) {
          return callback(res);
        },
        function(err) {
          return errorback(err);
        });
    },

    checkEmail: function(data, callback, errorback) {
      $resource('/auth/checkemail').auth(data,
        function(res) {
          return callback(res);
        },
        function(err) {
          return errorback(err);
        });
    },

    checkNick: function(data, callback, errorback) {
      $resource('/auth/checknick').auth(data,
        function(res) {
          return callback(res);
        },
        function(err) {
          return errorback(err);
        });
    }
  };
});

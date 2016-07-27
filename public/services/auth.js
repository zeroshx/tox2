var app = angular.module(ApplicationName);

app.factory('Auth', function($resource, $rootScope) {
  return {
    signup: function(user, callback) {
      var cb = callback || angular.noop;
      $resource('/auth/signup').create(user,
        function(user) {
          $rootScope.currentUser = user;
          return cb();
        },
        function(err) {
          return cb(err);
        });
    },

    login: function(user, callback) {
      var cb = callback || angular.noop;
      $resource('/auth/login').auth(user,
        function(user) {
          $rootScope.currentUser = user;
          return cb();
        },
        function(err) {
          return cb(err);
        });
    },

    logout: function(callback) {
      var cb = callback || angular.noop;
      $resource('/auth/logout').get(
        function(res) {
          $rootScope.currentUser = null;
          return cb();
        },
        function(err) {
          return cb(err);
        });
    },

    isAlive: function(callback) {
      var cb = callback || angular.noop;
      $resource('/auth/alive').get(
        function(res) {
          return cb();
        },
        function(err) {
          return cb(err);
        });
    }
  };
});

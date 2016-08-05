var app = angular.module('Auth');
app.factory('AuthService', function($resource, $location, $q) {
  return {
    signup: function() {
      return $resource('/auth/signup', {}, {
        run : {
          method : 'POST'
        }
      });
    },

    login: function() {
      return $resource('/auth/login', {}, {
        run : {
          method : 'POST'
        }
      });
    },

    logout: function() {
      return $resource('/auth/logout', {}, {
        run : {
          method : 'GET'
        }
      });
    },

    isAlive: function() {
      return $resource('/auth/alive', {}, {
        run : {
          method : 'GET'
        }
      });
    },

    isAliveQ: function() {
      var defer = $q.defer();
      $resource('/auth/alive').get(
        function(res) {
          if (res.session) {
            defer.resolve(res.session);
          } else {
            defer.reject();
            $location.path('/login');
          }
        }, function(err) {
          defer.reject();
          $location.path('/login');
        });
      return defer.promise;
    },

    checkEmail: function() {
      return $resource('/auth/checkemail', {}, {
        run : {
          method : 'POST'
        }
      });
    },

    checkNick: function() {
      return $resource('/auth/checknick', {}, {
        run : {
          method : 'POST'
        }
      });
    },

    me: function() {
      return $resource('/auth/me', {}, {
        run : {
          method : 'GET'
        }
      });
    },

    joinSite: function() {
      return $resource('/auth/me', {}, {
        run : {
          method : 'PUT'
        }
      });
    },

    joinDistributor: function() {
      return $resource('/auth/me', {}, {
        run : {
          method : 'PUT'
        }
      });
    }
  };
});

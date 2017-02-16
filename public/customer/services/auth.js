var app = angular.module(ApplicationName);
app.factory('AuthService', function($resource, $location, $window, $q) {
  return {

    Session: function() {
      var defer = $q.defer();
      $resource('/api/user/session').get(
        function(res) {
          defer.resolve();
        },
        function(err) {          
          defer.reject();
          $window.location = '/';
        });
      return defer.promise;
    },

    Me: function() {
      return $resource('/api/user/me', {}, {
        run: {
          method: 'GET'
        }
      });
    }
  };
});

angular.module('TOX2ADMINAPP')
  .factory('AuthService', function($resource, $location, $window, $q) {
  return {

    Session: function() {
      var defer = $q.defer();
      $resource('/user/session').get(
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
      return $resource('/user/me', {}, {
        run: {
          method: 'GET'
        }
      });
    }
  };
});

var app = angular.module(ApplicationName);
app.factory('AuthService', function($rootScope, $resource, $location, $window, $q, $filter) {
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

      function GetUserData() {
        return $q(function(resolve, reject) {
          $resource('/api/user/me').get(
            function(res) {
              $rootScope.me = res;
              $rootScope.me.cashCurrency = $filter('number')($rootScope.me.cash);
              $rootScope.me.chipCurrency = $filter('number')($rootScope.me.chip);
              $rootScope.me.pointCurrency = $filter('number')($rootScope.me.point);
              resolve();
            },
            function(err) {
              reject('GetUserData Rejected.');
            });
        });
      }

      function GetUserMessageCount() {
        return $q(function(resolve, reject) {
          $resource('/api/client/message/new').get(
            function(res) {
              $rootScope.me.messageCount = res.count;
              resolve();
            },
            function(err) {
              reject('GetUserMessageCount Rejected.');
            });
        });
      }

      return GetUserData()
      .then(GetUserMessageCount)
      .catch(function(reason) {
        console.log(reason);
        $window.location = '/logout';
      });
    }
  };
});

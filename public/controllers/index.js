angular.module('Distributor')
    .controller('IndexCtrl', function($rootScope, $scope) {

        /*
          if (preAuth && !$rootScope.currentUser) {
            AuthService.me().run(function(user) {
              $rootScope.currentUser = user;
            }, function(error) {
              console.log('err');
            });
          }
        */
        $scope.me = function() {
            console.log("This is Index Ctrl.");
        };

        $rootScope.submenu = [];
    });

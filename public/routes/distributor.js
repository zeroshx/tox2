angular.module('Distributor')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/distributor', {
          templateUrl: '/views/distributor.html',
          controller: 'DistributorCtrl',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.isAliveQ();
            }
          }
        })
        .when('/distributor/:distName', {
          templateUrl: '/views/distributor.html',
          controller: 'DistributorCtrl',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.isAliveQ();
            }
          }
        });
    }
  ]);

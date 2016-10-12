angular.module('Distributor')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/distributor', {
          templateUrl: '/views/distributor.html',
          controller: 'DistributorCtrl'
        })
        .when('/distributor/:distName', {
          templateUrl: '/views/distributor.html',
          controller: 'DistributorCtrl'
        });
    }
  ]);

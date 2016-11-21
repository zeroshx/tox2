angular.module('User')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/user', {
          templateUrl: '/views/user.html'
        //   resolve: {
        //     preAuth: function(AuthService) {
        //       return AuthService.isAliveQ();
        //     }
        //   }
        })
        .when('/user/history', {
          templateUrl: '/views/userhistory.html'
        //   resolve: {
        //     preAuth: function(AuthService) {
        //       return AuthService.isAliveQ();
        //     }
        //   }
        })
        .when('/user/stat', {
          templateUrl: '/views/userstat.html'
        //   resolve: {
        //     preAuth: function(AuthService) {
        //       return AuthService.isAliveQ();
        //     }
        //   }
        });
    }
  ]);

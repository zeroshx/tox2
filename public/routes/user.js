angular.module('User')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/user', {
          templateUrl: '/views/user.html',
          controller: 'UserCtrl',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.isAliveQ();
            }
          }
        })
        .when('/user/:userName', {
          templateUrl: '/views/user.html',
          controller: 'UserCtrl',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.isAliveQ();
            }
          }
        });
    }
  ]);

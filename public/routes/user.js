angular.module('User')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/user', {
          templateUrl: '/views/user.html',
          controller: 'UserCtrl'
        })
        .when('/user/:userName', {
          templateUrl: '/views/user.html',
          controller: 'UserCtrl'
        });
    }
  ]);

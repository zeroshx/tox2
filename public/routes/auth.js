angular.module('Auth')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: '/views/login.html',
          controller: 'AuthCtrl'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html',
          controller: 'AuthCtrl'
        });
    }
  ]);

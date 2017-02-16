angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/customer/views/index.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/my/deposit', {
          templateUrl: '/customer/views/deposit.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/notfound', {
          templateUrl: '/customer/views/404.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .otherwise('/notfound');
    }
  ]);

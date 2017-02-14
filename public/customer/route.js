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
        .when('/notfound', {
          templateUrl: '/admin/views/404.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .otherwise('/notfound');
    }
  ]);

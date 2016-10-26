angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/views/index.html',
          controller: 'IndexCtrl'
        })
        .when('/notfound', {
          templateUrl: '/views/404.html'
        })
        .when('/error', {
          templateUrl: '/views/error.html'
        })
        .otherwise('/notfound');
    }
  ]);

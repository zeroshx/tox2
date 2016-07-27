angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/views/home.html'
        })
        .when('/login', {
          templateUrl: '/views/login.html'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
        })
        .when('/notfound', {
          templateUrl: '/views/404.html'
        })
        .otherwise('/notfound');
    }
  ]);

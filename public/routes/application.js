angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/views/home.html'
        })
        .when('/contents', {
          templateUrl: '/views/contents.html'
        })
        .when('/login', {
          templateUrl: '/views/login.html',
          controller: 'AuthCtrl'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
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

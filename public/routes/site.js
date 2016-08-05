angular.module('Site')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/site', {
          templateUrl: '/views/site.html',
          controller: 'SiteCtrl'
        })
        .when('/site/:siteName', {
          templateUrl: '/views/site.html',
          controller: 'SiteCtrl'
        })
    }
  ]);

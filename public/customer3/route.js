angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/customer/views/index.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/my/deposit', {
          templateUrl: '/customer/views/deposit.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/my/withdrawal', {
          templateUrl: '/customer/views/withdrawal.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/my/message', {
          templateUrl: '/customer/views/message.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/community/board/free', {
          templateUrl: '/customer/views/board.free.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/community/question', {
          templateUrl: '/customer/views/question.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/distributor/beginning', {
          templateUrl: '/customer/views/distributor.beginning.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/distributor/signup', {
          templateUrl: '/customer/views/distributor.signup.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/distributor/setup', {
          templateUrl: '/customer/views/distributor.setup.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/distributor/info', {
          templateUrl: '/customer/views/distributor.info.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .when('/notfound', {
          templateUrl: '/customer/views/404.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Me();
            }
          }
        })
        .otherwise('/notfound');
    }
  ]);

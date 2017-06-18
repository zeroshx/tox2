angular.module('TOX2ADMINAPP')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/admin/interfaces/home/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/asset/deposit', {
          templateUrl: '/admin/interfaces/deposit/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/asset/withdrawal', {
          templateUrl: '/admin/interfaces/withdrawal/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/asset/report', {
          templateUrl: '/admin/interfaces/asset.report/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/client/question', {
          templateUrl: '/admin/interfaces/question/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/client/message', {
          templateUrl: '/admin/interfaces/message/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/client/board', {
          templateUrl: '/admin/interfaces/board/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/config/ipblock', {
          templateUrl: '/admin/interfaces/ipblock/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/config/blacklist', {
          templateUrl: '/admin/interfaces/blacklist/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/distributor', {
          templateUrl: '/admin/interfaces/distributor/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/match', {
          templateUrl: '/admin/interfaces/match/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/match/kind', {
          templateUrl: '/admin/interfaces/match.kind/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/match/league', {
          templateUrl: '/admin/interfaces/match.league/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site', {
          templateUrl: '/admin/interfaces/site/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site/level', {
          templateUrl: '/admin/interfaces/site.level/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site/config', {
          templateUrl: '/admin/interfaces/site.config/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user', {
          templateUrl: '/admin/interfaces/user/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user/history', {
          templateUrl: '/admin/interfaces/user.history/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user/stat', {
          templateUrl: '/admin/interfaces/user.stat/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/todo', {
          templateUrl: '/admin/interfaces/todo/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/config/manager', {
          templateUrl: '/admin/interfaces/manager/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/notfound', {
          templateUrl: '/admin/interfaces/404/view.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .otherwise('/');
    }
  ]);

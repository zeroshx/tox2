angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/admin/views/index.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/asset/deposit', {
          templateUrl: '/admin/views/deposit.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/asset/withdrawal', {
          templateUrl: '/admin/views/withdrawal.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/asset/report', {
          templateUrl: '/admin/views/asset.report.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/client/question', {
          templateUrl: '/admin/views/question.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/client/message', {
          templateUrl: '/admin/views/message.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/config/ipblock', {
          templateUrl: '/admin/views/ipblock.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/config/blacklist', {
          templateUrl: '/admin/views/blacklist.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/distributor', {
          templateUrl: '/admin/views/distributor.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/match', {
          templateUrl: '/admin/views/match.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/match/kind', {
          templateUrl: '/admin/views/match.kind.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        }).when('/match/league', {
          templateUrl: '/admin/views/match.league.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site', {
          templateUrl: '/admin/views/site.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site/level', {
          templateUrl: '/admin/views/site.level.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/site/config', {
          templateUrl: '/admin/views/site.config.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user', {
          templateUrl: '/admin/views/user.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user/history', {
          templateUrl: '/admin/views/user.history.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/user/stat', {
          templateUrl: '/admin/views/user.stat.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.Session();
            }
          }
        })
        .when('/todo', {
          templateUrl: '/admin/views/todo.html',
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

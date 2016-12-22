angular.module(ApplicationName)
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/admin/views/index.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/asset/deposit', {
          templateUrl: '/admin/views/deposit.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        }).when('/asset/withdrawal', {
          templateUrl: '/admin/views/withdrawal.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        }).when('/asset/report', {
          templateUrl: '/admin/views/asset.report.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/client/question', {
          templateUrl: '/admin/views/question.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/client/message', {
          templateUrl: '/admin/views/message.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/config/ipblock', {
          templateUrl: '/admin/views/ipblock.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/config/blacklist', {
          templateUrl: '/views/blacklist.html',
          resolve: {
            preAuth: function(AuthService) {
              return AuthService.isAliveQ();
            }
          }
        })
        .when('/distributor', {
          templateUrl: '/admin/views/distributor.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/match', {
          templateUrl: '/admin/views/match.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        }).when('/match/kind', {
          templateUrl: '/admin/views/match.kind.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        }).when('/match/league', {
          templateUrl: '/admin/views/match.league.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/site', {
          templateUrl: '/admin/views/site.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/site/level', {
          templateUrl: '/admin/views/site.level.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/site/config', {
          templateUrl: '/admin/views/site.config.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/user', {
          templateUrl: '/admin/views/user.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/user/history', {
          templateUrl: '/admin/views/user.history.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/user/stat', {
          templateUrl: '/admin/views/user.stat.html'
            //   resolve: {
            //     preAuth: function(AuthService) {
            //       return AuthService.isAliveQ();
            //     }
            //   }
        })
        .when('/todo', {
          templateUrl: '/admin/views/todo.html'
        })
        .when('/notfound', {
          templateUrl: '/admin/views/404.html'
        })
        .otherwise('/notfound');
    }
  ]);

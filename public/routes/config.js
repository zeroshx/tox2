angular.module('Config')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/config/ipblock', {
                    templateUrl: '/views/ipblock.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                })
                .when('/config/blacklist', {
                    templateUrl: '/views/blacklist.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

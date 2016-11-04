angular.module('Site')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/site', {
                    templateUrl: '/views/site.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                })
                .when('/site/level', {
                    templateUrl: '/views/sitelevel.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                })
                .when('/site/config', {
                    templateUrl: '/views/siteconfig.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

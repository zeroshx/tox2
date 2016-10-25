angular.module('Site')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/site', {
                    templateUrl: '/views/site.html',
                    controller: 'SiteCtrl',
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

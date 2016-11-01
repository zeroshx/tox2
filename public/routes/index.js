angular.module('Index')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/views/index.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

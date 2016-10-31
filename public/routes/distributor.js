angular.module('Distributor')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/distributor', {
                    templateUrl: '/views/distributor.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

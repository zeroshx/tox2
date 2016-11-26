angular.module('Finance')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/finance/deposit', {
                    templateUrl: '/views/deposit.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                }).when('/finance/withdrawal', {
                    templateUrl: '/views/withdrawal.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

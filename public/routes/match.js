angular.module('Distributor')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/match', {
                    templateUrl: '/views/match.html'
                        //   resolve: {
                        //     preAuth: function(AuthService) {
                        //       return AuthService.isAliveQ();
                        //     }
                        //   }
                }).when('/match/kind', {
                    templateUrl: '/views/matchkind.html'
                        //   resolve: {
                        //     preAuth: function(AuthService) {
                        //       return AuthService.isAliveQ();
                        //     }
                        //   }
                }).when('/match/league', {
                    templateUrl: '/views/matchleague.html'
                        //   resolve: {
                        //     preAuth: function(AuthService) {
                        //       return AuthService.isAliveQ();
                        //     }
                        //   }
                });
        }
    ]);

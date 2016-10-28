angular.module('Distributor')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/match/kind', {
                    templateUrl: '/views/matchkind.html',
                    controller: 'MatchKindCtrl',
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                }).when('/match/league', {
                    templateUrl: '/views/matchleague.html',
                    controller: 'MatchLeagueCtrl',
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

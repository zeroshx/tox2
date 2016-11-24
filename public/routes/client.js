angular.module('Client')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/client/question', {
                    templateUrl: '/views/question.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                })
                .when('/client/message', {
                    templateUrl: '/views/message.html'
                    //   resolve: {
                    //     preAuth: function(AuthService) {
                    //       return AuthService.isAliveQ();
                    //     }
                    //   }
                });
        }
    ]);

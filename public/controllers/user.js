angular.module('User')
    .controller('UserCtrl', function($scope, $rootScope, $location, $routeParams, $window, AuthService) {

        AuthService.me().run(function(user) {
            if(user.failure) {
            } else {
                $scope.user = user;
            }
        }, function(error) {});

        $scope.me = function() {
            console.log("This is UserCtrl Ctrl.");
        };
    });

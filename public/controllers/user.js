angular.module('User')
  .controller('UserCtrl', function($scope, $rootScope, $location, $routeParams, $window, AuthService) {

    AuthService.me().run(function(res) {
      if(res.hasOwnProperty('failure')) {
        $location.path('/login');
      } else {
        $scope.user = res;
      }
    }, function(error) {
      $location.path('/login');
    });

    $scope.me = function() {
      console.log("This is UserCtrl Ctrl.");
    };
  });

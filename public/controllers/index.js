var _app = angular.module(ApplicationName);

_app.controller('IndexCtrl', function($scope, $rootScope, $location, AuthService) {
/*
  if (preAuth && !$rootScope.currentUser) {
    AuthService.me().run(function(user) {
      $rootScope.currentUser = user;
    }, function(error) {
      console.log('err');
    });
  }
*/
  $scope.me = function() {
    console.log("This is Index Ctrl.");
  };
});

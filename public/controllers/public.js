var _app = angular.module(ApplicationName);
_app.controller('IndexCtrl', function($scope) {

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

_app.controller('HeaderCtrl', function($scope) {

    $scope.logout = function() {
        AuthService.logout().run(function(res) {
            $rootScope.currentUser = null;
            $rootScope.session = false;
            $location.path('/login');
        }, function(err) {});
    };
});

_app.controller('NavCtrl', function($scope) {
});

_app.controller('AsideCtrl', function($scope) {
});

_app.controller('SectionCtrl', function($scope) {
});

_app.controller('FooterCtrl', function($scope) {
});

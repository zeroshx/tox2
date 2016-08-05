var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($scope, $rootScope, $location, AuthService) {

  $scope.logout = function() {
    AuthService.logout().run(function(res) {
      console.log('logout success.');
      $rootScope.currentUser = null;
      $rootScope.session = false;
      $location.path('/login');
    }, function(err) {
      console.log(err);
    });
  };

  $scope.isAlive = function() {
    AuthService.isAlive().run(function(res) {
      $rootScope.session = res.session;
      console.log(res.session);
    }, function(err) {
      console.log(err);
    });
  };

  $scope.isAlive();
});

_app.controller('NavCtrl', function($scope, $rootScope, $location) {
  $scope.me = function() {
    console.log("This is Nav Ctrl.");
  };

});

_app.controller('AsideCtrl', function($scope) {
  $scope.me = function() {
    console.log("This is Aside Ctrl.");
  };
});

_app.controller('FooterCtrl', function($scope) {
  $scope.me = function() {
    console.log("This is Footer Ctrl.");
  };
});

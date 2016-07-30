var _app = angular.module(ApplicationName);

_app.controller('HeaderCtrl', function($scope) {
  $scope.me = function() {
    console.log("This is Header Ctrl.");
  };
});

_app.controller('NavCtrl', function($scope, $rootScope, $location, Auth) {
  $scope.me = function() {
    console.log("This is Nav Ctrl.");
  };

  $scope.logout = function() {
    Auth.logout(function() {
      console.log('logout success.');
      delete $rootScope.currentUser;
      $location.path('/login');
    }, function(err) {
      console.log(err);
    });
  };

  $scope.isAlive = function() {
    Auth.isAlive(function(res) {
      if (res.session) {
        console.log("session is alive!");
      } else {
        console.log("session is die!");
      }
    }, function(err) {
      console.log(err);
    });
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

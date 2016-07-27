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
    Auth.logout(function(err) {
      if (err) {
        console.log(err);
      } else {
        $location.path('/login');
      }
    });
  };

  $scope.isAlive = function() {
    Auth.isAlive(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("session is alive!");
      }
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

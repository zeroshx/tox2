angular.module(ApplicationName)
  .controller('AuthCtrl', function($scope, $location, Auth, $rootScope) {
    $scope.signup = function() {
      var user = $scope.user;
      Auth.signup({
        email: user.email,
        password: user.password,
        confirm: user.confirm
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          $location.path('/');
        }
      });
    };

    $scope.login = function() {
      var user = $scope.user;
      Auth.login({
        email: user.email,
        password: user.password
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          $location.path('/');
        }
      });
    };

  });

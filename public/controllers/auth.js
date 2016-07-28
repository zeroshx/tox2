angular.module(ApplicationName)
  .controller('AuthCtrl', function($scope, $location, $rootScope, Auth) {

    $scope.user = {
      email: '',
      password: '',
      confirm: '',
      nick: ''
    };

    $scope.validator = {
      server: {
        type: 'error',
        message: ''
      },
      email: {
        type: 'error',
        message: ''
      },
      nick: {
        type: 'error',
        message: ''
      },
      password: {
        type: 'error',
        message: ''
      },
      confirm: {
        type: 'error',
        message: ''
      }
    };

    $scope.validateEmail = function() {
      var rule = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($scope.user.email);
      if (rule) {
        $scope.validator.email.type = 'correct';
        $scope.validator.email.message = '중복확인 부탁드립니다~!';
      } else {
        $scope.validator.email.type = 'error';
        $scope.validator.email.message = '이메일 형식이 아니면 등록할 수 없어요.';
      }
    };

    $scope.validateNick = function() {
      if ($scope.user.nick.length < 2 || $scope.user.nick.length > 8) {
        $scope.validator.nick.type = 'error';
        $scope.validator.nick.message = '별명은 최소 2자, 최대 8자까지 가능합니다.';
      } else {
        $scope.validator.nick.type = 'correct';
        $scope.validator.nick.message = '이제 중복확인 해보시겠어요?';
      }
    };

    $scope.validatePassword = function() {
      if ($scope.user.password.length < 8 || $scope.user.password.length > 30) {
        $scope.validator.password.type = 'error';
        $scope.validator.password.message = '비밀번호는 최소 8자, 최대 30자까지 가능합니다.';
      } else {
        $scope.validator.password.type = 'correct';
        $scope.validator.password.message = '<비밀번호 확인>에 똑같이 입력해보세요.';
      }
    };

    $scope.validateConfirm = function() {
      if ($scope.validator.password.type != 'correct') {
        $scope.validator.confirm.type = 'error';
        $scope.validator.confirm.message = '비밀번호부터 정확하게 입력해주세요.';
      } else if ($scope.user.password != $scope.user.confirm) {
        $scope.validator.confirm.type = 'error';
        $scope.validator.confirm.message = '입력하신 비밀번호와 일치하지 않네요.';
      } else {
        $scope.validator.confirm.type = 'correct';
        $scope.validator.confirm.message = '정확합니다!';
      }
    };

    $scope.signup = function() {
      Auth.signup({
        email: $scope.user.email,
        password: $scope.user.password,
        confirm: $scope.user.confirm
      }, function(user) {
        $rootScope.currentUser = user;
        $location.path('/');
      }, function(err) {
        console.log(err);
      });
    };

    $scope.login = function() {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password,
      }, function(user) {
        $rootScope.currentUser = user;
        $location.path('/');
      }, function(err) {
        console.log(err);
      });
    };

    $scope.checkEmail = function() {
      Auth.checkEmail({
        email: $scope.user.email
      }, function(res) {
        if (res.exist) {
          $scope.validator.email.type = 'error';
          $scope.validator.email.message = '엇, 이미 사용중인 이메일이네요.';
        } else {
          $scope.validator.email.type = 'correct';
          $scope.validator.email.message = '사용하셔도 됩니다. ^^';
        }
      }, function(err) {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '서버에서 오류가 났네요. 새로고침 후에 다시 한번 도전!';
      });
    };

    $scope.checkNick = function() {
      Auth.checkNick({
        nick: $scope.user.nick
      }, function(res) {
        if (res.exist) {
          $scope.validator.nick.type = 'error';
          $scope.validator.nick.message = '누가 벌써 쓰고 있데요.';
        } else {
          $scope.validator.nick.type = 'correct';
          $scope.validator.nick.message = '오케이! 별명 정해졌습니다.';
        }
      }, function(err) {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '서버에서 오류가 났네요. 새로고침 후에 다시 한번 도전!';
      });
    };

  });

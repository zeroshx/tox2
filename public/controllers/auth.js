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
        message: '',
        check: false
      },
      nick: {
        type: 'error',
        message: '',
        check: false
      },
      password: {
        type: 'error',
        message: '',
        check: false
      },
      confirm: {
        type: 'error',
        message: '',
        check: false
      }
    };

    $scope.validateEmail = function(type) {
      var rule = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($scope.user.email);
      if (rule) {
        if (type == 'signup') {
          $scope.validator.email.type = 'correct';
          $scope.validator.email.message = '중복확인 부탁드립니다~!';
        } else {
          $scope.validator.email.check = true;
          $scope.validator.email.type = 'correct';
          $scope.validator.email.message = '';
        }
      } else {
        $scope.validator.email.type = 'error';
        $scope.validator.email.message = '이메일 형식으로 써주세요.';
      }
    };

    $scope.validateNick = function() {
      var rule = /^[가-힣a-zA-Z0-9]{2,8}$/g.test($scope.user.nick);
      if (rule) {
        $scope.validator.nick.type = 'correct';
        $scope.validator.nick.message = '중복확인 해보시겠어요~?';
      } else {
        $scope.validator.nick.type = 'error';
        $scope.validator.nick.message = '별명은 2~8자에 한글, 영문, 숫자만 가능합니다.';
      }
    };

    $scope.validatePassword = function() {
      var rule1 = /^[0-9a-zA-Z<>,\/?:;'"\\{}\[\]()`~@#$%^&+=.\-_*]{8,30}/i.test($scope.user.password);
      var rule2 = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!<>,\/?:;'"\\{}\[\]()`~@#$%^&+=.\-_*])([a-zA-Z0-9\!<>,\/?:;'"\\{}\[\]()`~@#$%^&+=*.\-_]){8,30}$/i.test($scope.user.password);
      if (rule2) {
        $scope.validator.password.check = true;
        $scope.validator.password.type = 'correct';
        $scope.validator.password.message = '안전제일! 그 누구도 해킹 불가능요~';
      } else if (rule1 && !rule2) {
        $scope.validator.password.check = true;
        $scope.validator.password.type = 'correct';
        $scope.validator.password.message = '써도 되긴한데..보안에 취약한 비밀번호에요.';
      } else {
        $scope.validator.password.type = 'error';
        $scope.validator.password.message = '비밀번호는 영문자, 숫자, 특수문자를 사용하여 8~30자까지 가능합니다.';
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
        $scope.validator.confirm.check = true;
        $scope.validator.confirm.type = 'correct';
        $scope.validator.confirm.message = '정확합니다!';
      }
    };

    $scope.signup = function() {
      if ($scope.validator.email.check &&
        $scope.validator.nick.check &&
        $scope.validator.password.check &&
        $scope.validator.confirm.check) {
        Auth.signup({
          email: $scope.user.email,
          nick: $scope.user.nick,
          password: $scope.user.password,
          confirm: $scope.user.confirm
        }, function(user) {
          if(user.hasOwnProperty('failure')) {
            $scope.validator.server.type = 'error';
            $scope.validator.server.message = user.failure;
          } else {
            $rootScope.currentUser = user;
            $location.path('/');
          }
        }, function(err) {
          $scope.validator.server.type = 'error';
          $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
        });
      } else {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '가입 양식을 정확히 입력했는지 확인해바래요~';
      }
    };

    $scope.login = function() {
      if ($scope.validator.email.check) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password,
        }, function(user) {
          if(user.hasOwnProperty('failure')) {
            $scope.validator.server.type = 'error';
            $scope.validator.server.message = user.failure;
          } else {
            $rootScope.currentUser = user;
            $location.path('/');
          }
        }, function(err) {
          $scope.validator.server.type = 'error';
          $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
        });
      } else {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '로그인 이메일이 잘못된 것 같네요.';
      }
    };

    $scope.checkEmail = function() {
      Auth.checkEmail({
        email: $scope.user.email
      }, function(res) {
        if (res.exist) {
          $scope.validator.email.type = 'error';
          $scope.validator.email.message = '엇, 이미 사용중인 이메일이네요.';
        } else {
          $scope.validator.email.check = true;
          $scope.validator.email.type = 'correct';
          $scope.validator.email.message = '사용하셔도 됩니다. ^^';
        }
      }, function(err) {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
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
          $scope.validator.nick.check = true;
          $scope.validator.nick.type = 'correct';
          $scope.validator.nick.message = '오케이! 이걸로 쓰시죠.';
        }
      }, function(err) {
        $scope.validator.server.type = 'error';
        $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
      });
    };

  });

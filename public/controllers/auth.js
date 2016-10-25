angular.module('Auth')
    .controller('AuthCtrl', function($scope, $rootScope, $location, AuthService) {
        
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
                message: ''
            },
            confirm: {
                type: 'error',
                message: ''
            }
        };

        $scope.signup = function() {
            if ($scope.validator.email.check && $scope.validator.nick.check) {
                AuthService.signup().run({
                    email: $scope.user.email,
                    nick: $scope.user.nick,
                    password: $scope.user.password,
                    confirm: $scope.user.confirm
                }, function(user) {
                    if (user.hasOwnProperty('failure')) {
                        $scope.validator.server.type = 'error';
                        $scope.validator.server.message = user.failure;
                    } else {
                        $rootScope.currentUser = user;
                        $rootScope.session = true;
                        $location.path('/');
                    }
                }, function(err) {
                    $scope.validator.server.type = 'error';
                    $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
                });
            } else {
                $scope.validator.server.type = 'error';
                $scope.validator.server.message = '이메일 및 별명 중복확인 바랍니다.';
            }
        };

        $scope.login = function() {
            AuthService.login().run({
                email: $scope.user.email,
                password: $scope.user.password,
            }, function(user) {
                if (user.hasOwnProperty('failure')) {
                    $scope.validator.server.type = 'error';
                    $scope.validator.server.message = user.failure;
                } else {
                    $rootScope.currentUser = user;
                    $rootScope.session = true;
                    $location.path('/');
                }
            }, function(err) {
                $scope.validator.server.type = 'error';
                $scope.validator.server.message = '비정상적인 접근은 차단하겠습니다.';
            });
        };

        $scope.checkEmail = function() {
            AuthService.checkEmail().run({
                email: $scope.user.email
            }, function(res) {
                if (res.failure) {
                    $scope.validator.email.type = 'error';
                    $scope.validator.email.message = res.failure;
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
            AuthService.checkNick().run({
                nick: $scope.user.nick
            }, function(res) {
                if (res.failure) {
                    $scope.validator.nick.type = 'error';
                    $scope.validator.nick.message = res.failure;
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

    }); // end of controller

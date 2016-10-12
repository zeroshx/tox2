angular.module('Distributor')
  .controller('DistributorCtrl', function($scope, $rootScope, $location, $routeParams, $window, DistributorService) {

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $scope.dists = null;
    $scope.distDetail = null;

    $scope.single = function(id) {
      DistributorService.single(id).run(function(dist) {
        $scope.distDetail = dist;
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
      });
    };

    $scope.list = function() {
      DistributorService.list().run(function(dists) {
        $scope.dists = dists;
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
      });
    };
    $scope.create = function() {
      if ($scope.validator.check) {
        DistributorService.create().run({
          name: $scope.dist.name,
          memo: $scope.dist.memo
        }, function(res) {
          if (res.hasOwnProperty('failure')) {
            $scope.validator.type = 'error';
            $scope.validator.message = res.failure;
          } else {
            $scope.validator.message = '';
            $scope.dists.push({
              _id: res._id,
              name: res.name,
              memo: res.memo
            });
          }
        }, function(err) {
          $scope.validator.type = 'error';
          $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
        });
      }
    };
    $scope.update = function() {
      DistributorService.update().run({
        _id: $scope.distDetail._id,
        name: $scope.distDetail.name,
        memo: $scope.distDetail.memo
      }, function(res) {
        alert('수정되었습니다.');
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
      });
    };

    $scope.delete = function(id) {
      DistributorService.delete(id).run(function(res) {
        alert('삭제되었습니다.');
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
      });
    };

    $scope.validateDistName = function() {
      var rule = /^[가-힣a-zA-Z0-9]{2,16}$/g.test($scope.dist.name);
      if (rule) {
        $scope.validator.check = true;
        $scope.validator.type = 'correct';
        $scope.validator.message = '';
      } else {
        $scope.validator.check = false;
        $scope.validator.type = 'error';
        $scope.validator.message = '한글, 영문, 숫자 조합으로 최소 2자에서 12자 이내로 입력해주세요.';
      }
    };

    $scope.me = function() {
      console.log("This is Distributor Ctrl.");
    };

    if ($window.name == 'distDetail') {
      $scope.single($routeParams.distName);
    } else {
      $scope.list();
    }
  });

angular.module('Distributor')
    .controller('DistributorCtrl', function($scope, $rootScope, $location, $routeParams, $window, DistributorService) {

        $scope.validator = {
            type: 'error',
            message: ''
        };

        $scope.dists = [];
        $scope.distDetail = null;

        $scope.create = function() {
            DistributorService.create().run({
                name: $scope.dist.name,
                memo: $scope.dist.memo
            }, function(res) {
                if (res.failure) {
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
        };

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

        if ($window.name == 'distDetail') {
            $scope.single($routeParams.distName);
        } else {
            $scope.list();
        }
    });

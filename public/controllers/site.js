angular.module('Site')
    .controller('SiteCtrl', function($scope, $rootScope, $location, $routeParams, $window, SiteService) {

        $scope.validator = {
            type: 'error',
            message: ''
        };

        $scope.sites = [];
        $scope.siteDetail = null;

        $scope.create = function() {
            SiteService.create().run({
                name: $scope.site.name,
                memo: $scope.site.memo
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.sites.push({
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
            SiteService.single(id).run(function(site) {
                $scope.siteDetail = site;
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
            });
        };

        $scope.list = function() {
            SiteService.list().run(function(sites) {
                if(sites.failure) {
                    $scope.validator.type = 'error';
                    //$scope.validator.message = sites.failure;
                } else {
                    $scope.sites = sites;
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
            });
        };

        $scope.update = function() {
            SiteService.update().run({
                _id: $scope.siteDetail._id,
                name: $scope.siteDetail.name,
                memo: $scope.siteDetail.memo
            }, function(res) {
                alert('수정되었습니다.');
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
            });
        };

        $scope.delete = function(id) {
            SiteService.delete(id).run(function(res) {
                alert('삭제되었습니다.');
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근은 차단하겠습니다.';
            });
        };

        if ($window.name == 'siteDetail') {
            $scope.single($routeParams.siteName);
        } else {
            $scope.list();
        }
    });

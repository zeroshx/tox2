angular.module('Site')
    .controller('SiteCtrl', function($rootScope, $scope, $window, $location, $routeParams, $httpParamSerializer, SiteService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/site';

        $scope.query = {
            page: parseInt($routeParams.page ? $routeParams.page : 1),
            pageSize: parseInt($routeParams.pageSize ? $routeParams.pageSize : 20),
            searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
            searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
            searchFilterName: $routeParams.searchFilterName ? $routeParams.searchFilterName : ''
        };

        $scope.validator = {
            type: 'error',
            message: ''
        };

        $scope.sites = [];


        /****************************************************************************
            Search setting
        ****************************************************************************/
        $scope.searchFilters = [{
            Filter: '이름 ',
            mode: 'name'
        }, {
            Filter: '메모 ',
            mode: 'memo'
        }, {
            Filter: '이름+메모 ',
            mode: 'name+memo'
        }];

        $scope.SelectSearchFilter = function(i) {
            $scope.query.searchFilterName = $scope.searchFilters[i].Filter;
            $scope.query.searchFilter = $scope.searchFilters[i].mode;
        };

        $scope.Search = function() {
            if ($scope.query.searchKeyword.length > 0) {
                if ($scope.query.searchFilter.length === 0) {
                    $scope.validator.type = 'info';
                    $scope.validator.message = '검색하시려면 검색필터를 선택해주세요.';
                } else {
                    $scope.query.page = 1;
                    $scope.list();
                }
            } else {
                $scope.query.searchKeyword = '';
                $scope.query.page = 1;
                $scope.list();
            }
        };

        /****************************************************************************
            Pagination setting
        ****************************************************************************/
        $scope.pages = [];
        $scope.Pagination = function(curPage, totalPage, baseUrl, curQuery) {
            var pages = [];
            var query = {};
            angular.copy(curQuery, query);
            var where = curPage % 8;
            if (where === 0) {
                where = 8;
            }

            pages[where - 1] = {
                number: curPage,
                active: true,
                link: baseUrl + '?' + $httpParamSerializer(query)
            };

            for (i = 0; i < (where - 1); i++) {
                query.page = curPage - i - 1;
                pages[where - i - 2] = {
                    number: curPage - i - 1,
                    active: false,
                    link: baseUrl + '?' + $httpParamSerializer(query)
                };
            }

            for (i = 0; i < (8 - where); i++) {
                if (curPage + i + 1 <= totalPage) {
                    query.page = curPage + i + 1;
                    pages[where + i] = {
                        number: curPage + i + 1,
                        active: false,
                        link: baseUrl + '?' + $httpParamSerializer(query)
                    };
                }
            }

            return pages;
        };

        $scope.NextPage = function() {
            if ($scope.query.page < $scope.totalPage) {
                $scope.query.page++;
                $location.url($scope.baseUrl + '?' + $httpParamSerializer($scope.query));
            }
        };

        $scope.PreviousPage = function() {
            if (($scope.query.page - 1) > 0) {
                $scope.query.page--;
                $location.url($scope.baseUrl + '?' + $httpParamSerializer($scope.query));
            }
        };

        $scope.LastPage = function() {
            $scope.query.page = $scope.totalPage;
            $location.url($scope.baseUrl + '?' + $httpParamSerializer($scope.query));
        };

        /****************************************************************************
            Form On/Off setting
        ****************************************************************************/
        $scope.createFormFlag = false;
        $scope.modifyFormFlag = false;

        $scope.CreateFormOpen = function() {
            $scope.createFormFlag = true;
            $scope.modifyFormFlag = false;
        };

        $scope.CreateFormClose = function() {
            $scope.createFormFlag = false;
            $scope.createName = '';
            $scope.createMemo = '';
        };

        $scope.ModifyFormOpen = function(id) {
            $scope.createFormFlag = false;
            $scope.modifyFormFlag = true;
            for (i = 0; i < $scope.sites.length; i++) {
                if ($scope.sites[i]._id == id) {
                    $scope.modifyId = $scope.sites[i]._id;
                    $scope.modifyName = $scope.sites[i].name;
                    $scope.modifyMemo = $scope.sites[i].memo;
                    break;
                }
            }
        };

        $scope.ModifyFormClose = function() {
            $scope.modifyFormFlag = false;
            $scope.modifyId = '';
            $scope.modifyName = '';
            $scope.modifyMemo = '';
        };


        /****************************************************************************
            Http CRUD setting
        ****************************************************************************/
        $scope.create = function() {
            SiteService.create().run({
                name: $scope.createName,
                memo: $scope.createMemo
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.CreateFormClose();
                    alert("추가되었습니다.");
                    $scope.list();
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.list = function() {
            SiteService.list().run($scope.query, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                    $scope.sites = [];
                    $scope.query.searchKeyword = '';
                } else {
                    $scope.totalPage = res.count;
                    if ($scope.query.page > $scope.totalPage) {
                        $scope.LastPage();
                    }
                    $scope.sites = res.sites;
                    $scope.CreateMemoShortcut();
                    $scope.pages = $scope.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
                    $scope.validator.message = '';
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.update = function(id) {
            SiteService.update(id).run({
                name: $scope.modifyName,
                memo: $scope.modifyMemo
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.ModifyFormClose();
                    alert('수정되었습니다.');
                    $scope.list();
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.delete = function(id) {
            SiteService.delete(id).run(function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    alert('삭제되었습니다.');
                    $scope.list();
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };


        /****************************************************************************
            Etc Functions
        ****************************************************************************/
        $scope.CreateMemoShortcut = function() {
            for (i = 0; i < $scope.sites.length; i++) {
                if ($scope.sites[i].memo.length > 20) {
                    $scope.sites[i].shortMemo = $scope.sites[i].memo.slice(0, 20);
                    $scope.sites[i].shortMemo += '...';
                } else {
                    $scope.sites[i].shortMemo = $scope.sites[i].memo;
                }
            }
        };

        $scope.ChangePageSize = function() {
            $scope.query.page = 1;
            $location.url($scope.baseUrl + '?' + $httpParamSerializer($scope.query));
        };


        /****************************************************************************
            Controller Init
        ****************************************************************************/
        $scope.SelectSearchFilter(0);
        $scope.list();
    });

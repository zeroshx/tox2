angular.module('Match')
    .controller('MatchKindCtrl', function($rootScope, $scope, $routeParams, Upload, CRUDService, PublicService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/match/kind';

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

        $scope.docs = [];

        /****************************************************************************
            Sub Menu setting
        ****************************************************************************/
        $rootScope.submenu = [
            {
                name: '배팅 관리',
                link: '/match/betting'
            }, {
                name: '경기 관리',
                link: '/match'
            }, {
                name: '종목 관리',
                link: '/match/kind'
            }, {
                name: '리그 관리',
                link: '/match/league'
            }
        ];


        /****************************************************************************
            Search setting
        ****************************************************************************/
        $scope.searchFilters = [{
            Filter: '종목명 ',
            mode: 'name'
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
                    $scope.FirstPage();
                }
            } else {
                $scope.query.searchKeyword = '';
                $scope.FirstPage();
            }
        };

        /****************************************************************************
            Pagination setting
        ****************************************************************************/
        $scope.pages = [];

        $scope.NextPage = function() {
            if ($scope.query.page < $scope.totalPage) {
                $scope.query.page++;
                $scope.List();
            }
        };

        $scope.PreviousPage = function() {
            if (($scope.query.page - 1) > 0) {
                $scope.query.page--;
                $scope.List();
            }
        };

        $scope.LastPage = function() {
            $scope.query.page = $scope.totalPage;
            $scope.List();
        };

        $scope.FirstPage = function() {
            $scope.query.page = 1;
            $scope.List();
        };

        /****************************************************************************
            Form On/Off setting
        ****************************************************************************/
        $scope.formSwitch = false;
        $scope.formMode = '';

        $scope.FormOpen = function(mode, id) {
            $scope.formMode = mode;
            $scope.formSwitch = true;

            if (mode === 'UPDATE') {
                var docCheck = false;
                for (var i in $scope.docs) {
                    if ($scope.docs[i]._id === id) {
                        docCheck = true;
                        $scope.targetId = $scope.docs[i]._id;
                        $scope.targetName = $scope.docs[i].name;
                    }
                }
                if (!docCheck) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
                }
            } else { // mode === 'CREATE'
                $scope.ResetTarget();
            }
        };

        $scope.FormClose = function() {
            $scope.formSwitch = false;
            $scope.forMode = '';
            $scope.file = null;
            $scope.ResetTarget();
        };


        /****************************************************************************
            Http CRUD setting
        ****************************************************************************/
        $scope.Create = function() {
            Upload.upload({
                url: $scope.baseUrl,
                method: 'POST',
                data: {
                    image: $scope.file,
                    name: $scope.targetName
                }
            }).then(function(res) { //success
                if (res.data.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.data.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    alert("추가되었습니다.");
                    $scope.List();
                }
            }, function(res) { //failure
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            }, function(evt) {
                //console.log(evt);
            });
        };

        $scope.Update = function() {
            Upload.upload({
                url: $scope.baseUrl + "/" + $scope.targetId,
                method: 'PUT',
                data: {
                    image: $scope.file,
                    name: $scope.targetName
                }
            }).then(function(res) { //success
                if (res.data.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.data.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    alert("수정되었습니다.");
                    $scope.List();
                }
            }, function(res) { //failure
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            }, function(evt) {
                //console.log(evt);
            });
        };

        $scope.List = function() {
            CRUDService.Read($scope.baseUrl).run($scope.query, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                    $scope.docs = [];
                    $scope.query.searchKeyword = '';
                } else {
                    $scope.totalPage = res.count;
                    if ($scope.query.page > $scope.totalPage) {
                        $scope.LastPage();
                    }
                    $scope.docs = res.docs;
                    $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.Delete = function(id, mode) {
            CRUDService.Delete($scope.baseUrl, id).run(function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    if (mode === 'ONE') {
                        $scope.validator.message = '';
                        $scope.selectAllSwitch = false;
                        alert('삭제되었습니다.');
                        $scope.List();
                    } else {
                        $scope.deleteSuccess++;
                        if ($scope.deleteSuccess === $scope.deleteTotal) {
                            $scope.validator.message = '';
                            $scope.selectAllSwitch = false;
                            alert("삭제되었습니다.");
                            $scope.List();
                        }
                    }
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.DeleteAll = function() {
            $scope.deleteTotal = 0;
            $scope.deleteSuccess = 0;
            for (var i in $scope.docs) {
                if ($scope.docs[i].checked) {
                    $scope.deleteTotal++;
                    $scope.Delete($scope.docs[i]._id, 'MANY');
                }
            }
        };


        /****************************************************************************
            Etc Functions
        ****************************************************************************/
        $scope.CreateShortcut = function(element, length) {
            for (i = 0; i < $scope.docs.length; i++) {
                if ($scope.docs[i][element].length > length) {
                    $scope.docs[i]['short_' + element] = $scope.docs[i][element].slice(0, length);
                    $scope.docs[i]['short_' + element] += '...';
                } else {
                    $scope.docs[i]['short_' + element] = $scope.docs[i][element];
                }
            }
        };

        $scope.ChangePageSize = function() {
            $scope.query.pageSize = parseInt($scope.query.pageSize);
            if ($scope.query.pageSize > 0) {
                $scope.query.page = 1;
                $scope.List();
            } else {
                alert("1이상의 수를 입력해주세요.");
            }
        };

        $scope.SelectAll = function() {
            if ($scope.selectAllSwitch) {
                for (var i in $scope.docs) {
                    $scope.docs[i].checked = true;
                }
            } else {
                for (var j in $scope.docs) {
                    $scope.docs[j].checked = false;
                }
            }
        };

        $scope.ResetTarget = function() {
            $scope.targetId = '';
            $scope.targetName = '';
            $scope.targetImagePath = '';
        };

        /****************************************************************************
            Controller Init
        ****************************************************************************/
        $scope.SelectSearchFilter(0);
        $scope.ResetTarget();
        $scope.List();
    });

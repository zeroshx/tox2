angular.module('Config')
    .controller('IPBlockCtrl', function($rootScope, $scope, $routeParams, CRUDService, PublicService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/config/ipblock';

        $scope.query = {
            page: Number($routeParams.page ? $routeParams.page : 1),
            pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
            searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
            searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : ''
        };

        $scope.validator = {
            type: 'error',
            message: ''
        };

        $scope.docs = [];

        /****************************************************************************
            Sub Menu setting
        ****************************************************************************/
        for(var i in $rootScope.mainmenu) {
            if($rootScope.mainmenu[i].name === '설정') {
                $rootScope.submenu = $rootScope.mainmenu[i].submenu;
            }
        }


        /****************************************************************************
            Search setting
        ****************************************************************************/
        $scope.searchFilters = [
            '선택', '아이피', '메모'
        ];

        $scope.Search = function(mode) {
            if (mode === 'RESET') {
                $scope.ResetQuery();
                $scope.Reset();
            } else {
                $scope.FirstPage();
            }
        };


        /****************************************************************************
            Pagination setting
        ****************************************************************************/
        $scope.pages = [];

        $scope.MovePage = function(page) {
            $scope.query.page = Number(page);
            $scope.List();
        };

        $scope.NextPage = function() {
            var page = Number($scope.query.page);
            var totalPage = Number($scope.totalPage);
            if (page < totalPage) {
                $scope.query.page = page + 1;
                $scope.List();
            }
        };

        $scope.PreviousPage = function() {
            var page = Number($scope.query.page);
            if ((page - 1) > 0) {
                $scope.query.page = page - 1;
                $scope.List();
            }
        };

        $scope.LastPage = function() {
            $scope.query.page = Number($scope.totalPage);
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
        $scope.forMode = '';

        $scope.FormOpen = function(mode, id) {
            $scope.ResetTarget();
            $scope.formMode = mode;
            $scope.formSwitch = true;

            if (mode === 'UPDATE') {
                var docCheck = false;
                for (var i in $scope.docs) {
                    if ($scope.docs[i]._id === id) {
                        docCheck = true;
                        $scope.targetId = $scope.docs[i]._id;
                        $scope.targetIp = $scope.docs[i].ip;
                        $scope.targetMemo = $scope.docs[i].memo;
                    }
                }
                if (!docCheck) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
                }
            } else { // mode === 'CREATE'

            }
        };

        $scope.FormClose = function() {
            $scope.formSwitch = false;
            $scope.forMode = '';
            $scope.validator.message = '';
        };


        /****************************************************************************
            Http CRUD setting
        ****************************************************************************/
        $scope.Create = function() {
            CRUDService.Create($scope.baseUrl).run({
                ip: $scope.targetIp,
                memo: $scope.targetMemo
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    $scope.List();
                    alert("추가되었습니다.");
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
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
                    $scope.docs = res.docs;
                    $scope.totalPage = res.count;
                    $scope.RenderList();
                    $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        $scope.Update = function() {
            CRUDService.Update($scope.baseUrl, $scope.targetId).run({
                ip: $scope.targetIp,
                memo: $scope.targetMemo
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    $scope.List();
                    alert('수정되었습니다.');
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
                            $scope.List();
                            alert("삭제되었습니다.");
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
        $scope.RenderList = function() {
            // step 1. create memo shortcut
            for (i = 0; i < $scope.docs.length; i++) {
                $scope.docs[i].short_memo = $scope.CreateShortcut($scope.docs[i].memo, 20);
            }
        };

        $scope.CreateShortcut = function(str, length) {
            if(!str || !angular.isString(str)) {
                return null;
            }
            if (str.length > length) {
                return str.slice(0, length) + '...';
            } else {
                return str;
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

        $scope.ResetQuery = function() {
            $scope.query.page = 1;
            $scope.query.pageSize = 20;
            $scope.query.searchKeyword = '';
            $scope.query.searchFilter = '';
        };

        $scope.ResetTarget = function() {
            $scope.targetId = null;
            $scope.targetIp = null;
            $scope.targetMemo = null;
        };

        $scope.Reset = function () {
            $scope.formSwitch = null;
            $scope.List();
            $scope.ResetTarget();
        };

        /****************************************************************************
            Controller Init
        ****************************************************************************/
        $scope.Reset();
    });

angular.module('Site')
    .controller('SiteLevelCtrl', function($rootScope, $scope, $routeParams, $filter, CRUDService, PublicService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/site/level';

        $scope.query = {
            page: parseInt($routeParams.page ? $routeParams.page : 1),
            pageSize: parseInt($routeParams.pageSize ? $routeParams.pageSize : 20),
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
            if($rootScope.mainmenu[i].name === '사이트') {
                $rootScope.submenu = $rootScope.mainmenu[i].submenu;
            }
        }


        /****************************************************************************
            Search setting
        ****************************************************************************/
        $scope.searchFilters = [
            '레벨', '사이트'
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
            $scope.query.page = page;
            $scope.List();
        };

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
                var siteCheck = false;
                for (var i in $scope.docs) {
                    if ($scope.docs[i]._id === id) {
                        siteCheck = true;
                        $scope.targetId = $scope.docs[i]._id;
                        $scope.targetName = $scope.docs[i].name;
                        $scope.targetBonusWin = $scope.docs[i].bonus.win;
                        $scope.targetBonusLose = $scope.docs[i].bonus.lose;
                        $scope.targetBonusCharge = $scope.docs[i].bonus.charge;
                        $scope.targetBonusRecommender = $scope.docs[i].bonus.recommender;
                        $scope.targetSingleMaxBet = $scope.docs[i].single.maxBet;
                        $scope.targetSingleMaxRate = $scope.docs[i].single.maxRate;
                        $scope.targetMultiMaxBet = $scope.docs[i].multi.maxBet;
                        $scope.targetMultiMaxRate = $scope.docs[i].multi.maxRate;
                        $scope.targetSite = $scope.docs[i].site;
                    }
                }
                if (!siteCheck) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
                }
            } else if (mode === 'CREATE'){
                $scope.ResetTarget();
            }
        };

        $scope.FormClose = function() {
            $scope.formSwitch = false;
            $scope.forMode = '';
            $scope.validator.message = '';
            $scope.ResetTarget();
        };

        /****************************************************************************
            Input Site Select setting
        ****************************************************************************/
        $scope.siteList = [];
        $scope.SelectSite = function(name) {
            $scope.targetSite = name;
        };

        $scope.SiteList = function() {
            CRUDService.Read('/site/all').run(function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.siteList = res.docs;
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };

        /****************************************************************************
            Http CRUD setting
        ****************************************************************************/
        $scope.Create = function() {
            CRUDService.Create($scope.baseUrl).run({
                name: $scope.targetName,
                bonusWin: $scope.targetBonusWin,
                bonusLose: $scope.targetBonusLose,
                bonusCharge: $scope.targetBonusCharge,
                bonusRecommender: $scope.targetBonusRecommender,
                singleMaxBet: $scope.targetSingleMaxBet,
                singleMaxRate: $scope.targetSingleMaxRate,
                multiMaxBet: $scope.targetMultiMaxBet,
                multiMaxRate: $scope.targetMultiMaxRate,
                site: $scope.targetSite
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    alert("추가되었습니다.");
                    $scope.List();
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
                    $scope.CreateExtraData();
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
                name: $scope.targetName,
                bonusWin: $scope.targetBonusWin,
                bonusLose: $scope.targetBonusLose,
                bonusCharge: $scope.targetBonusCharge,
                bonusRecommender: $scope.targetBonusRecommender,
                singleMaxBet: $scope.targetSingleMaxBet,
                singleMaxRate: $scope.targetSingleMaxRate,
                multiMaxBet: $scope.targetMultiMaxBet,
                multiMaxRate: $scope.targetMultiMaxRate,
                site: $scope.targetSite
            }, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.validator.message = '';
                    $scope.selectAllSwitch = false;
                    $scope.FormClose();
                    alert('수정되었습니다.');
                    $scope.List();
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
                        if($scope.deleteSuccess === $scope.deleteTotal){
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
                    $scope.docs[i]['short_'+element] = $scope.docs[i][element].slice(0, length);
                    $scope.docs[i]['short_'+element] += '...';
                } else {
                    $scope.docs[i]['short_'+element] = $scope.docs[i][element];
                }
            }
        };

        $scope.ChangePageSize = function() {
            $scope.query.pageSize = parseInt($scope.query.pageSize);
            if($scope.query.pageSize > 0) {
                $scope.query.page = 1;
                $scope.List();
            } else {
                alert("1이상의 수를 입력해주세요.");
            }
        };

        $scope.SelectAll = function() {
            if($scope.selectAllSwitch) {
                for (var i in $scope.docs) {
                    $scope.docs[i].checked = true;
                }
            } else {
                for (var j in $scope.docs) {
                    $scope.docs[j].checked = false;
                }
            }
        };

        $scope.CreateExtraData = function() {
            for (var i in $scope.docs) {
                $scope.docs[i].single.maxBetCurrency = $filter('number')($scope.docs[i].single.maxBet);
                $scope.docs[i].multi.maxBetCurrency = $filter('number')($scope.docs[i].multi.maxBet);
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
            $scope.targetName = null;
            $scope.targetBonusWin = null;
            $scope.targetBonusLose = null;
            $scope.targetBonusCharge = null;
            $scope.targetBonusRecommender = null;
            $scope.targetSingleMaxBet = null;
            $scope.targetSingleMaxRate = null;
            $scope.targetMultiMaxBet = null;
            $scope.targetMultiMaxRate = null;
            $scope.targetSite = null;
        };

        $scope.Reset = function () {
            $scope.ResetTarget();
            $scope.List();
            $scope.SiteList();
        };


        /****************************************************************************
            Controller Init
        ****************************************************************************/
        $scope.Reset();
    });

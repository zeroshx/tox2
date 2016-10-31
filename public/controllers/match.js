angular.module('Match')
    .controller('MatchCtrl', function($rootScope, $scope, $routeParams, $filter, Upload, CRUDService, PublicService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/match';

        $scope.query = {
            page: parseInt($routeParams.page ? $routeParams.page : 1),
            pageSize: parseInt($routeParams.pageSize ? $routeParams.pageSize : 20),
            searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
            searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
            searchFilterName: $routeParams.searchFilterName ? $routeParams.searchFilterName : '',
            listMode: $routeParams.listMode ? $routeParams.listMode : 'WAY',
            state: $routeParams.state ? $routeParams.state : 'ALL',
            mtype: $routeParams.mtype ? $routeParams.mtype : 'ALL',
            kind: $routeParams.kind ? $routeParams.kind : 'ALL',
            league: $routeParams.league ? $routeParams.league : 'ALL',
            result: $routeParams.result ? $routeParams.result : 'ALL'
        };

        $scope.validator = {
            type: 'error',
            message: ''
        };

        $scope.docs = [];

        /****************************************************************************
            Sub Menu setting
        ****************************************************************************/
        $rootScope.submenu = [{
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
        }];


        /****************************************************************************
            Search setting
        ****************************************************************************/
        $scope.searchFilters = [{
            Filter: '홈팀 ',
            mode: 'home'
        }, {
            Filter: '원정팀 ',
            mode: 'away'
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
            $scope.LeagueList();
            $scope.KindList();
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
                $scope.targetBtype = '3-WAY';
                $scope.targetMtype = '일반';
                $scope.targetState = '등록';
                $scope.targetResult = '대기';

                var nowTime = new Date();
                $scope.targetSchedule = new Date(
                    nowTime.getFullYear(),
                    nowTime.getMonth(),
                    nowTime.getDate(),
                    nowTime.getHours(),
                    nowTime.getMinutes());
            }
        };

        $scope.FormClose = function() {
            $scope.formSwitch = false;
            $scope.forMode = '';
            $scope.ResetTarget();
        };

        /****************************************************************************
            Match Kind setting
        ****************************************************************************/
        $scope.kindList = [];

        $scope.KindList = function() {
            CRUDService.Read('/match/kind/all').run($scope.query, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.kindList = res.docs;
                }
            }, function(err) {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
            });
        };


        /****************************************************************************
            Match League setting
        ****************************************************************************/
        $scope.leagueList = [];

        $scope.LeagueList = function() {
            CRUDService.Read('/match/league/all').run($scope.query, function(res) {
                if (res.failure) {
                    $scope.validator.type = 'error';
                    $scope.validator.message = res.failure;
                } else {
                    $scope.leagueList = res.docs;
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
                homeName: $scope.targetHomeName,
                awayName: $scope.targetAwayName,
                homeScore: $scope.targetHomeScore,
                awayScore: $scope.targetAwayScore,
                homeRate: $scope.targetHomeRate,
                drawRate: $scope.targetDrawRate,
                awayRate: $scope.targetAwayRate,
                variety: $scope.targetVariety,
                offset: $scope.targetOffset,
                league: $scope.targetLeague,
                kind: $scope.targetKind,
                state: $scope.targetState,
                btype: $scope.targetBtype,
                mtype: $scope.targetMtype,
                schedule:$scope.targetSchedule,
                result: $scope.targetResult
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

        $scope.Update = function(id) {
            CRUDService.Update($scope.baseUrl, id).run({
                name: $scope.targetName,
                memo: $scope.targetMemo,
                bonusWin: $scope.targetBonusWin,
                bonusLose: $scope.targetBonusLose
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
            $scope.targetHomeName = '';
            $scope.targetAwayName = '';
            $scope.targetHomeScore = '';
            $scope.targetAwayScore = '';
            $scope.targetOffset = '';
            $scope.targetHomeRate = '';
            $scope.targetAwayRate = '';
            $scope.targetDrawRate = '';
            $scope.targetLeague = '';
            $scope.targetKind = '';
            $scope.targetSchedule = '';
            $scope.targetBtype = '';
            $scope.targetMtype = '';
            $scope.targetResult = '';
            $scope.targetState = '';
            $scope.targetVariety = [];
        };

        $scope.SelectKind = function(kind) {
            $scope.targetKind = kind;
        };

        $scope.SelectLeague = function(league) {
            $scope.targetLeague = league;
        };

        $scope.SelectState = function(state) {
            $scope.targetState = state;
        };

        $scope.SelectBettingType = function(btype) {

            if (btype === '2-WAY') {
                $scope.targetMtype = '일반';
                $scope.targetVariety = [];
            } else if (btype === '3-WAY') {
                $scope.targetMtype = '일반';
                $scope.targetVariety = [];
            } else if (btype === 'VARIETY') {
                $scope.targetMtype = '일반';
                $scope.targetVariety = [{
                        pick: '선택1',
                        name: '',
                        rate: ''
                    }, {
                        pick: '선택2',
                        name: '',
                        rate: ''
                    }, {
                        pick: '선택3',
                        name: '',
                        rate: ''
                    }, {
                        pick: '선택4',
                        name: '',
                        rate: ''
                    }];
            } else {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
                $scope.FormClose();
                return;
            }
            $scope.targetBtype = btype;
        };

        $scope.SelectMatchType = function(mtype) {

            if (mtype === '일반') {

            } else if (mtype === '핸디캡') {
                if ($scope.targetBtype !== '2-WAY') {
                    $scope.validator.type = 'info';
                    $scope.validator.message = '핸디캡 매치는 2-WAY 방식만 지원합니다.';
                    $scope.targetBtype = '2-WAY';
                    $scope.targetMtype = '핸디캡';
                    return;
                }
            } else if (mtype === '언더오버') {
                if ($scope.targetBtype !== '2-WAY') {
                    $scope.validator.type = 'info';
                    $scope.validator.message = '언더오버 매치는 2-WAY 방식만 지원합니다.';
                    $scope.targetBtype = '2-WAY';
                    $scope.targetMtype = '언더오버';
                    return;
                }
            } else {
                $scope.validator.type = 'error';
                $scope.validator.message = '비정상적인 접근입니다.';
                $scope.FormClose();
            }
            $scope.targetMtype = mtype;
        };

        $scope.AddPick = function() {
            if ($scope.targetVariety.length < 20) {
                $scope.targetVariety.push({
                    pick: '선택'+($scope.targetVariety.length+1),
                    name: '',
                    rate: ''
                });
            } else {
                $scope.validator.type = 'info';
                $scope.validator.message = '배팅 픽 개수는 최대 20개까지입니다.';
            }
        };

        $scope.RemovePick = function() {
            if ($scope.targetVariety.length > 3) {
                $scope.targetVariety.splice($scope.targetVariety.length - 1, 1);
            } else {
                $scope.validator.type = 'info';
                $scope.validator.message = '2개 이하의 픽 경기는 2-WAY, 3-WAY 타입으로 생성해주세요.';
            }
        };

        $scope.SelectResult = function(result) {
            $scope.targetResult = result;
        };

        $scope.DisplayValue = function() {
            console.log($scope);
        };


        /****************************************************************************
            Controller Init
        ****************************************************************************/
        $scope.SelectSearchFilter(0);
        $scope.ResetTarget();
        $scope.List();
    });
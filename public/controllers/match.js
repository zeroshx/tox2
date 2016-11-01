angular.module('Match')
    .controller('MatchCtrl', function($rootScope, $scope, $routeParams, $filter, Upload, CRUDService, PublicService) {

        /****************************************************************************
            Basic Vars setting
        ****************************************************************************/
        $scope.baseUrl = '/match';

        $scope.viewMode = 'WAY';

        $scope.query = {
            page: parseInt($routeParams.page ? $routeParams.page : 1),
            pageSize: parseInt($routeParams.pageSize ? $routeParams.pageSize : 20),
            searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
            searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
            searchFilterName: $routeParams.searchFilterName ? $routeParams.searchFilterName : '',
            listMode: $routeParams.listMode ? $routeParams.listMode : 'WAY',
            state: $routeParams.state ? $routeParams.state : '전체',
            mtype: $routeParams.mtype ? $routeParams.mtype : '전체',
            kind: $routeParams.kind ? $routeParams.kind : '전체',
            league: $routeParams.league ? $routeParams.league : '전체',
            result: $routeParams.result ? $routeParams.result : '전체'
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
        }, {
            Filter: '매치주제 ',
            mode: 'subject'
        }];

        $scope.SelectSearchFilter = function(i) {
            $scope.query.searchFilterName = $scope.searchFilters[i].Filter;
            $scope.query.searchFilter = $scope.searchFilters[i].mode;
        };

        $scope.Search = function(mode) {

            if (mode === 'RESET') {
                $scope.ResetQuery();
                $scope.SelectSearchFilter(0);
                $scope.ResetTarget();
                $scope.List();
                $scope.LeagueList();
                $scope.KindList();
            } else {
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
                        $scope.targetHomeName = $scope.docs[i].home.name;
                        $scope.targetAwayName = $scope.docs[i].away.name;
                        $scope.targetHomeScore = $scope.docs[i].home.score;
                        $scope.targetAwayScore = $scope.docs[i].away.score;
                        $scope.targetHomeRate = $scope.docs[i].home.rate;
                        $scope.targetTieRate = $scope.docs[i].tie.rate;
                        $scope.targetAwayRate = $scope.docs[i].away.rate;
                        $scope.targetVarietySubject = $scope.docs[i].variety.subject;
                        $scope.targetVarietyPicks = $scope.docs[i].variety.picks;
                        $scope.targetOffset = $scope.docs[i].offset;
                        $scope.targetLeague = $scope.docs[i].league;
                        $scope.targetKind = $scope.docs[i].kind;
                        $scope.targetState = $scope.docs[i].state;
                        $scope.targetBtype = $scope.docs[i].btype;
                        $scope.targetMtype = $scope.docs[i].mtype;
                        $scope.targetSchedule = new Date($scope.docs[i].schedule);
                        $scope.targetResult = $scope.docs[i].result;
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
            $scope.validator.message = '';
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
                tieRate: $scope.targetTieRate,
                awayRate: $scope.targetAwayRate,
                varietySubject: $scope.targetVarietySubject,
                varietyPicks: $scope.targetVarietyPicks,
                offset: $scope.targetOffset,
                league: $scope.targetLeague,
                kind: $scope.targetKind,
                state: $scope.targetState,
                btype: $scope.targetBtype,
                mtype: $scope.targetMtype,
                schedule: $filter('date')($scope.targetSchedule, 'yyyy-MM-dd HH:mm'),
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

        $scope.Update = function() {
            CRUDService.Update($scope.baseUrl, $scope.targetId).run({
                homeName: $scope.targetHomeName,
                awayName: $scope.targetAwayName,
                homeScore: $scope.targetHomeScore,
                awayScore: $scope.targetAwayScore,
                homeRate: $scope.targetHomeRate,
                tieRate: $scope.targetTieRate,
                awayRate: $scope.targetAwayRate,
                varietySubject: $scope.targetVarietySubject,
                varietyPicks: $scope.targetVarietyPicks,
                offset: $scope.targetOffset,
                league: $scope.targetLeague,
                kind: $scope.targetKind,
                state: $scope.targetState,
                btype: $scope.targetBtype,
                mtype: $scope.targetMtype,
                schedule: $filter('date')($scope.targetSchedule, 'yyyy-MM-dd HH:mm'),
                result: $scope.targetResult
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
                    $scope.viewMode = $scope.query.listMode;
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

        $scope.ResetQuery = function() {
            $scope.query.page = 1;
            $scope.query.pageSize = 20;
            $scope.query.searchKeyword = '';
            $scope.query.searchFilter = '';
            $scope.query.searchFilterName = '';
            $scope.query.listMode = 'WAY';
            $scope.query.state = '전체';
            $scope.query.mtype = '전체';
            $scope.query.kind = '전체';
            $scope.query.league = '전체';
            $scope.query.result = '전체';
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
            $scope.targetTieRate = '';
            $scope.targetLeague = '';
            $scope.targetKind = '';
            $scope.targetSchedule = '';
            $scope.targetBtype = '';
            $scope.targetMtype = '';
            $scope.targetResult = '';
            $scope.targetState = '';
            $scope.targetVarietySubject = '';
            $scope.targetVarietyPicks = [];
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
            } else if (btype === '3-WAY') {
                $scope.targetMtype = '일반';
            } else if (btype === 'VARIETY') {
                $scope.targetMtype = '일반';
                $scope.targetVarietyPicks = [{
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
            if ($scope.targetVarietyPicks.length < 20) {
                $scope.targetVarietyPicks.push({
                    pick: '선택' + ($scope.targetVarietyPicks.length + 1),
                    name: '',
                    rate: ''
                });
            } else {
                $scope.validator.type = 'info';
                $scope.validator.message = '배팅 픽 개수는 최대 20개까지입니다.';
            }
        };

        $scope.RemovePick = function() {
            if ($scope.targetVarietyPicks.length > 3) {
                $scope.targetVarietyPicks.splice($scope.targetVarietyPicks.length - 1, 1);
                $scope.targetResult = '';
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
        $scope.LeagueList();
        $scope.KindList();
    });

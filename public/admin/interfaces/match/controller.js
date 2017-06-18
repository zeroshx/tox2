angular.module('TOX2ADMINAPP')
  .controller('MatchCtrl', function($rootScope, $scope, $routeParams, $filter, $window, $anchorScroll, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/match';

    $scope.viewMode = 'WAY';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
      searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
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
    for (var i in $rootScope.mainmenu) {
      if ($rootScope.mainmenu[i].name === '매치') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '홈팀', '원정팀', '매치주제'
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
    $scope.formMode = '';

    $scope.FormOpen = function(mode, id) {
      $scope.ResetTarget();
      $scope.formMode = mode;
      $scope.formSwitch = true;

      if (mode === 'UPDATE' || mode === 'VERIFY') {
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
            $scope.targetVarietyOption = $scope.docs[i].variety.option;
            $scope.targetOffset = $scope.docs[i].offset;
            $scope.targetLeague = $scope.docs[i].league;
            $scope.targetKind = $scope.docs[i].kind;
            $scope.targetState = $scope.docs[i].state;
            $scope.targetBtype = $scope.docs[i].btype;
            $scope.targetMtype = $scope.docs[i].mtype;
            $scope.targetSchedule = $scope.docs[i].schedule.replace(/-/g, '/');
            $scope.targetSchedule = new Date($scope.targetSchedule);
            $scope.targetTemp = $scope.docs[i].schedule;
            $scope.targetResult = $scope.docs[i].result;
          }
        }
        if (!docCheck) {
          $scope.validator.type = 'error';
          $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
          $anchorScroll(0);
        }
      } else { // mode === 'CREATE'
        $scope.targetVarietyOption = [];
        $scope.targetBtype = '3-WAY';
        $scope.targetMtype = '일반';
        $scope.targetState = '등록';
      }
    };

    $scope.FormClose = function() {
      $scope.formSwitch = false;
      $scope.forMode = '';
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
          $anchorScroll(0);
        } else {
          $scope.kindList = res.docs;
        }
      }, function(err) {
        $window.location = '/';
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
          $anchorScroll(0);
        } else {
          $scope.leagueList = res.docs;
        }
      }, function(err) {
        $window.location = '/';
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
        varietyOption: $scope.targetVarietyOption,
        offset: $scope.targetOffset,
        league: $scope.targetLeague,
        kind: $scope.targetKind,
        state: $scope.targetState,
        btype: $scope.targetBtype,
        mtype: $scope.targetMtype,
        schedule: $scope.targetSchedule
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
          $scope.FormClose();
          $scope.List();
          alert("추가되었습니다.");
        }
      }, function(err) {
        $window.location = '/';
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
        varietyOption: $scope.targetVarietyOption,
        offset: $scope.targetOffset,
        league: $scope.targetLeague,
        kind: $scope.targetKind,
        state: $scope.targetState,
        btype: $scope.targetBtype,
        mtype: $scope.targetMtype,
        schedule: $scope.targetSchedule
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
          $scope.FormClose();
          $scope.List();
          alert('수정되었습니다.');
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run($scope.query, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $scope.docs = [];
          $scope.query.searchKeyword = '';
          $anchorScroll(0);
        } else {
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.RenderList();
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
          $scope.viewMode = $scope.query.listMode;
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Delete = function(id, mode) {
      CRUDService.Delete($scope.baseUrl, id).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          if (mode === 'ONE') {
            $scope.validator.message = '';
            $scope.selectAllSwitch = false;
            $scope.List();
            alert('삭제되었습니다.');
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
        $window.location = '/';
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
    $scope.CreateShortcut = function(obj, element, length) {
      if (obj[element].length > length) {
        obj['short_' + element] = obj[element].slice(0, length);
        obj['short_' + element] += '...';
      } else {
        obj['short_' + element] = obj[element];
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
      $scope.query.listMode = 'WAY';
      $scope.query.state = '전체';
      $scope.query.mtype = '전체';
      $scope.query.kind = '전체';
      $scope.query.league = '전체';
      $scope.query.result = '전체';
    };

    $scope.ResetTarget = function() {
      $scope.targetId = null;
      $scope.targetHomeName = null;
      $scope.targetAwayName = null;
      $scope.targetHomeScore = null;
      $scope.targetAwayScore = null;
      $scope.targetOffset = null;
      $scope.targetHomeRate = null;
      $scope.targetAwayRate = null;
      $scope.targetTieRate = null;
      $scope.targetLeague = null;
      $scope.targetKind = null;
      $scope.targetSchedule = null;
      $scope.targetBtype = null;
      $scope.targetMtype = null;
      $scope.targetResult = null;
      $scope.targetState = null;
      $scope.targetVarietySubject = null;
      $scope.targetVarietyOption = null;
    };

    $scope.SelectKind = function(kind) {
      $scope.targetKind = kind;
    };

    $scope.SelectLeague = function(league) {
      $scope.targetLeague = league;
    };

    $scope.SelectState = function(state) {
      if ($scope.formMode === 'CREATE' && state === '마감') {
        $scope.validator.type = 'info';
        $scope.validator.message = '마감 상태로 매치를 생성할 경우 배팅할 수 없습니다.';
      }
      $scope.targetState = state;
    };

    $scope.SelectBettingType = function(btype) {

      if (btype === '2-WAY') {
        $scope.targetMtype = '일반';
      } else if (btype === '3-WAY') {
        $scope.targetMtype = '일반';
      } else if (btype === 'VARIETY') {
        $scope.targetMtype = '일반';
        $scope.targetVarietyOption = [{
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

    $scope.AddOption = function() {
      if ($scope.targetVarietyOption.length < 20) {
        $scope.targetVarietyOption.push({
          pick: '선택' + ($scope.targetVarietyOption.length + 1),
          name: '',
          rate: ''
        });
      } else {
        $scope.validator.type = 'info';
        $scope.validator.message = '배팅 픽 개수는 최대 20개까지입니다.';
      }
    };

    $scope.RemoveOption = function(index) {
      if ($scope.targetVarietyOption.length > 4) {
        $scope.targetVarietyOption.splice(index, 1);
      } else {
        $scope.validator.type = 'info';
        $scope.validator.message = '3개 이하의 픽 경기는 2-WAY, 3-WAY 타입으로 생성해주세요.';
      }
    };

    $scope.SelectResult = function(result) {
      $scope.targetResult = result;
    };

    $scope.RenderList = function() {
      if ($scope.query.listMode === 'VARIETY') {
        for (var i in $scope.docs) {
          $scope.docs[i].totalBet = 0;
          $scope.docs[i].totalBetCount = 0;
          for (var j in $scope.docs[i].variety.option) {
            $scope.docs[i].totalBet += $scope.docs[i].variety.option[j].bet;
            $scope.docs[i].totalBetCount += $scope.docs[i].variety.option[j].count;
          }
        }
      } else { // Way mode
        for (var m in $scope.docs) {
          $scope.CreateShortcut($scope.docs[m].home, 'name', 15);
          $scope.CreateShortcut($scope.docs[m].away, 'name', 15);
        }
      }
    };

    $scope.DisplayValue = function() {
      console.log($scope[$scope.debugName]);
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.ResetTarget();
      $scope.List();
      $scope.LeagueList();
      $scope.KindList();
    };

    $scope.SetDatetimePicker = function () {
      $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        dayViewHeaderFormat: 'YYYY MMMM',
        sideBySide: true,
        locale: 'ko'
      });
      $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        dayViewHeaderFormat: 'YYYY MMMM',
        sideBySide: true,
        locale: 'ko'
      });
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.SetDatetimePicker();
    $scope.Reset();
  });

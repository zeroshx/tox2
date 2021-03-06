angular.module('TOX2ADMINAPP')
  .controller('SiteCtrl', function($rootScope, $scope, $routeParams, $window, $filter, $anchorScroll, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/site';

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
    for (var i in $rootScope.mainmenu) {
      if ($rootScope.mainmenu[i].name === '사이트') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '사이트', '메모', '사이트+메모'
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
        var siteCheck = false;
        for (var i in $scope.docs) {
          if ($scope.docs[i]._id === id) {
            siteCheck = true;
            $scope.targetId = $scope.docs[i]._id;
            $scope.targetState = $scope.docs[i].state;
            $scope.targetName = $scope.docs[i].name;
            $scope.targetMemo = $scope.docs[i].memo;
            $scope.targetConfigLevel = $scope.docs[i].config.level;
            $scope.targetConfigCash = $scope.docs[i].config.cash;
            $scope.targetConfigMoney = $scope.docs[i].config.chip;
            $scope.targetConfigPoint = $scope.docs[i].config.point;
            $scope.targetBonusWin = $scope.docs[i].bonus.win;
            $scope.targetBonusLose = $scope.docs[i].bonus.lose;
            $scope.targetBonusFirstDeposit = $scope.docs[i].bonus.firstDeposit;
            $scope.targetBonusDeposit = $scope.docs[i].bonus.deposit;

            if (!$scope.docs[i].answer) {
              $scope.targetAnswer = [];
            } else {
              $scope.targetAnswer = $scope.docs[i].answer;
            }

            $scope.LevelList();
          }
        }
        if (!siteCheck) {
          $scope.validator.type = 'error';
          $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
          $anchorScroll(0);
        }
      } else if (mode === 'CREATE') {
        $scope.targetState = '정지';
        $scope.targetAnswer = [];
        $scope.LevelFilterList();
      }
    };

    $scope.FormClose = function() {
      $scope.formSwitch = false;
      $scope.forMode = null;
      $scope.validator.message = null;
      $scope.levelList = [];
    };


    /****************************************************************************
        Input Level Select setting
    ****************************************************************************/
    $scope.levelList = [];
    $scope.SelectLevel = function(name) {
      $scope.targetConfigLevel = name;
    };

    $scope.LevelList = function() {
      CRUDService.Read('/site/level/forsite/' + $scope.targetName).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.levelList = res.docs;
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.LevelFilterList = function() {
      CRUDService.Read('/site/level/all').run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.levelList = res.docs;
          for(var i = 0; i<$scope.levelList.length; i++) {
            $scope.levelList[i].name = $scope.levelList[i]._id;
          }
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
        state: $scope.targetState,
        name: $scope.targetName,
        configLevel: $scope.targetConfigLevel,
        configCash: $scope.targetConfigCash,
        configMoney: $scope.targetConfigMoney,
        configPoint: $scope.targetConfigPoint,
        bonusWin: $scope.targetBonusWin,
        bonusLose: $scope.targetBonusLose,
        bonusSignup: $scope.targetBonusSignup,
        bonusFirstDeposit: $scope.targetBonusFirstDeposit,
        bonusDeposit: $scope.targetBonusDeposit,
        answer: $scope.targetAnswer,
        memo: $scope.targetMemo
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
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl, $scope.targetId).run({
        state: $scope.targetState,
        configLevel: $scope.targetConfigLevel,
        configCash: $scope.targetConfigCash,
        configMoney: $scope.targetConfigMoney,
        configPoint: $scope.targetConfigPoint,
        bonusWin: $scope.targetBonusWin,
        bonusLose: $scope.targetBonusLose,
        bonusSignup: $scope.targetBonusSignup,
        bonusFirstDeposit: $scope.targetBonusFirstDeposit,
        bonusDeposit: $scope.targetBonusDeposit,
        answer: $scope.targetAnswer,
        memo: $scope.targetMemo
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
    $scope.RenderList = function() {
      // step 1. create memo shortcut
      for (i = 0; i < $scope.docs.length; i++) {
        $scope.docs[i].short_memo = $scope.CreateShortcut($scope.docs[i].memo, 20);
      }
    };

    $scope.CreateShortcut = function(str, length) {
      if (!str || !angular.isString(str)) {
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
      $scope.targetName = null;
      $scope.targetMemo = null;
      $scope.targetConfigLevel = null;
      $scope.targetConfigCash = null;
      $scope.targetConfigMoney = null;
      $scope.targetConfigPoint = null;
      $scope.targetBonusWin = null;
      $scope.targetBonusLose = null;
      $scope.targetBonusFirstDeposit = null;
      $scope.targetBonusDeposit = null;
      $scope.targetState = null;
      $scope.targetAnswer = null;
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.ResetTarget();
      $scope.List();
    };

    $scope.SelectState = function(state) {
      $scope.targetState = state;
    };

    $scope.AddAnswer = function() {
      if ($scope.targetAnswer.length < 20) {
        $scope.targetAnswer.push({
          action: '',
          title: '',
          content: ''
        });
      } else {
        $scope.validator.type = 'info';
        $scope.validator.message = '안내멘트는 최대 20개까지 가능합니다.';
        $anchorScroll(0);
      }
    };

    $scope.RemoveAnswer = function (idx) {
      $scope.targetAnswer.splice(idx, 1);
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

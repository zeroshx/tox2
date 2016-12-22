angular.module('User')
  .controller('UserCtrl', function($rootScope, $scope, $routeParams, $filter, $window, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/user';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
      searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
      site: $routeParams.site ? $routeParams.site : '전체',
      distributor: $routeParams.distributor ? $routeParams.distributor : '전체',
      state: $routeParams.state ? $routeParams.state : '전체',
      level: $routeParams.level ? $routeParams.level : '전체'
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
      if ($rootScope.mainmenu[i].name === '회원') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '선택', '아이디', '닉네임', '예금주'
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

      if (mode === 'UPDATE') {
        var docCheck = false;
        for (var i in $scope.docs) {
          if ($scope.docs[i]._id === id) {
            docCheck = true;
            $scope.targetId = $scope.docs[i]._id;
            $scope.targetUid = $scope.docs[i].uid;
            $scope.targetNick = $scope.docs[i].nick;
            $scope.targetPassword = $scope.docs[i].password;
            $scope.targetPhone = $scope.docs[i].phone;
            $scope.targetCash = $scope.docs[i].cash;
            $scope.targetMoney = $scope.docs[i].money;
            $scope.targetPoint = $scope.docs[i].point;
            $scope.targetDebt = $scope.docs[i].debt;
            $scope.targetAccountHolder = $scope.docs[i].account.holder;
            $scope.targetAccountBank = $scope.docs[i].account.bank;
            $scope.targetAccountNumber = $scope.docs[i].account.number;
            $scope.targetAccountPin = $scope.docs[i].account.pin;
            $scope.targetSite = $scope.docs[i].site;
            $scope.targetDistributor = $scope.docs[i].distributor;
            $scope.targetState = $scope.docs[i].state;
            $scope.targetLevel = $scope.docs[i].level;
            $scope.targetRecommander = $scope.docs[i].recommander;
            if ($scope.docs[i].memo) {
              $scope.targetMemo = $scope.docs[i].memo;
            } else {
              $scope.targetMemo = [];
            }
            $scope.DistributorList();
            $scope.LevelList();
          }
        }
        if (!docCheck) {
          $scope.validator.type = 'error';
          $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
        }
      } else { // mode === 'CREATE'
        $scope.targetMemo = [];
      }
    };

    $scope.FormClose = function() {
      $scope.formSwitch = false;
      $scope.forMode = '';
      $scope.validator.message = '';
    };

    /****************************************************************************
        Input Distributor Select setting
    ****************************************************************************/
    $scope.distributorList = [];
    $scope.distributorFilterList = [];
    $scope.SelectDistributor = function(name) {
      $scope.targetDistributor = name;
    };

    $scope.DistributorList = function() {
      CRUDService.Read('/distributor/forsite/' + $scope.targetSite).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.distributorList = res.docs;
        }
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근입니다.';
      });
    };

    $scope.DistributorFilterList = function() {
      CRUDService.Read('/distributor/all').run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.distributorFilterList = res.docs;
        }
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근입니다.';
      });
    };

    /****************************************************************************
        Input Level Select setting
    ****************************************************************************/
    $scope.levelList = [];
    $scope.levelFilterList = [];
    $scope.SelectLevel = function(name) {
      $scope.targetLevel = name;
    };

    $scope.LevelList = function() {
      CRUDService.Read('/site/level/forsite/' + $scope.targetSite).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.levelList = res.docs;
        }
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근입니다.';
      });
    };

    $scope.LevelFilterList = function() {
      CRUDService.Read('/site/level/all').run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.levelFilterList = res.docs;
        }
      }, function(err) {
        $scope.validator.type = 'error';
        $scope.validator.message = '비정상적인 접근입니다.';
      });
    };

    /****************************************************************************
        Input Site Select setting
    ****************************************************************************/
    $scope.siteList = [];
    $scope.SelectSite = function(name) {
      $scope.targetSite = name;
      $scope.targetDistributor = null;
      $scope.targetLevel = null;
      $scope.distributorList = null;
      $scope.levelList = null;
      $scope.DistributorList();
      $scope.LevelList();
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
        uid: $scope.targetUid,
        nick: $scope.targetNick,
        password: $scope.targetPassword,
        phone: $scope.targetPhone,
        cash: $scope.targetCash,
        money: $scope.targetMoney,
        point: $scope.targetPoint,
        debt: $scope.targetDebt,
        accountHolder: $scope.targetAccountHolder,
        accountBank: $scope.targetAccountBank,
        accountNumber: $scope.targetAccountNumber,
        accountPin: $scope.targetAccountPin,
        site: $scope.targetSite,
        distributor: $scope.targetDistributor,
        state: $scope.targetState,
        level: $scope.targetLevel,
        memo: $scope.targetMemo,
        recommander: $scope.targetRecommander
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
        $window.location = '/';
      });
    };

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl, $scope.targetId).run({
        password: $scope.targetPassword,
        phone: $scope.targetPhone,
        cash: $scope.targetCash,
        money: $scope.targetMoney,
        point: $scope.targetPoint,
        accountHolder: $scope.targetAccountHolder,
        accountBank: $scope.targetAccountBank,
        accountNumber: $scope.targetAccountNumber,
        accountPin: $scope.targetAccountPin,
        site: $scope.targetSite,
        distributor: $scope.targetDistributor,
        state: $scope.targetState,
        level: $scope.targetLevel,
        memo: $scope.targetMemo,
        recommander: $scope.targetRecommander
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
      for (var m in $scope.docs) {
        $scope.docs[m].stat.depositCurrency = $filter('number')($scope.docs[m].stat.deposit);
        $scope.docs[m].stat.withdrawalCurrency = $filter('number')($scope.docs[m].stat.withdrawal);
        $scope.docs[m].stat.totalCurrency = $filter('number')($scope.docs[m].stat.deposit - $scope.docs[m].stat.withdrawal);
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

    $scope.AddMemo = function() {
      var datetime = new Date();
      $scope.targetMemo.push({
        content: '',
        date: datetime.toLocaleDateString() + ' ' + datetime.toLocaleTimeString()
      });
    };

    $scope.RemoveMemo = function(idx) {
      $scope.targetMemo.splice(idx, 1);
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
      $scope.query.searchKeyword = '';
      $scope.query.searchFilter = '';
      $scope.query.site = '전체';
      $scope.query.distributor = '전체';
      $scope.query.state = '전체';
      $scope.query.level = '전체';
    };

    $scope.ResetTarget = function() {
      $scope.targetId = null;
      $scope.targetUid = null;
      $scope.targetNick = null;
      $scope.targetPassword = null;
      $scope.targetPhone = null;
      $scope.targetCash = null;
      $scope.targetMoney = null;
      $scope.targetPoint = null;
      $scope.targetDebt = null;
      $scope.targetAccountHolder = null;
      $scope.targetAccountBank = null;
      $scope.targetAccountNumber = null;
      $scope.targetAccountPin = null;
      $scope.targetSite = null;
      $scope.targetDistributor = null;
      $scope.targetState = null;
      $scope.targetLevel = null;
      $scope.targetRecommander = null;
      $scope.targetMemo = null;
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.ResetTarget();
      $scope.List();
      $scope.SiteList();
      $scope.LevelFilterList();
      $scope.DistributorFilterList();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

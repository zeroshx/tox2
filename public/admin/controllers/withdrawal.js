angular.module('Asset')
  .controller('WithdrawalCtrl', function($rootScope, $scope, $routeParams, $filter, $window, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/asset/withdrawal';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
      searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
      site: $routeParams.site ? $routeParams.site : '전체',
      distributor: $routeParams.distributor ? $routeParams.distributor : '전체',
      state: $routeParams.state ? $routeParams.state : '전체'
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
      if ($rootScope.mainmenu[i].name === '재정') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


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
        Input Distributor Select setting
    ****************************************************************************/
    $scope.distributorList = [];
    $scope.SelectDistributor = function(name) {
      $scope.targetDistributor = name;
    };

    $scope.DistributorList = function() {
      CRUDService.Read('/distributor/all').run(function(res) {
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


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '선택', '예금주', '닉네임', '사이트', '총판'
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
      $scope.SiteList();
      $scope.DistributorList();
      $scope.formMode = mode;
      $scope.formSwitch = true;

      if ($scope.formMode === 'UPDATE') {
        var docCheck = false;
        for (var i in $scope.docs) {
          if ($scope.docs[i]._id === id) {
            docCheck = true;
            $scope.targetId = $scope.docs[i]._id;
            $scope.targetNick = $scope.docs[i].nick;
            $scope.targetHolder = $scope.docs[i].holder;
            $scope.targetSite = $scope.docs[i].site;
            $scope.targetDistributor = $scope.docs[i].distributor;
            $scope.targetCash = $scope.docs[i].cash;
            $scope.targetState = $scope.docs[i].state;
          }
        }
        if (!docCheck) {
          $scope.validator.type = 'error';
          $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
        }
      } else { // mode === 'CREATE'
        $scope.targetState = '신청';
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
        nick: $scope.targetNick,
        holder: $scope.targetHolder,
        site: $scope.targetSite,
        distributor: $scope.targetDistributor,
        cash: $scope.targetCash,
        state: $scope.targetState
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

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl, $scope.targetId).run({
        nick: $scope.targetNick,
        holder: $scope.targetHolder,
        cash: $scope.targetCash,
        state: $scope.targetState
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

    $scope.Accept = function() {
      CRUDService.Update($scope.baseUrl + '/accept', $scope.targetId).run({
        nick: $scope.targetNick,
        holder: $scope.targetHolder,
        cash: $scope.targetCash,
        state: $scope.targetState
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
    $scope.ChangeState = function(id) {
      $scope.ResetTarget();
      var docCheck = false;
      for (var i in $scope.docs) {
        if ($scope.docs[i]._id === id) {
          $scope.targetId = $scope.docs[i]._id;
          $scope.targetNick = $scope.docs[i].nick;
          $scope.targetHolder = $scope.docs[i].holder;
          $scope.targetState = '승인';
          $scope.Accept();
          break;
        }
      }
      if (!docCheck) {
        $scope.validator.type = 'error';
        $scope.validator.message = '새로고침 후 다시 시도해주세요.';
      }
    };

    $scope.RenderList = function() {
      for (var m in $scope.docs) {
        $scope.docs[m].cashCurrency = $filter('number')($scope.docs[m].cash);
      }
    };

    $scope.ChangePageSize = function() {
      $scope.query.pageSize = Number($scope.query.pageSize);
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
      $scope.query.site = '전체';
      $scope.query.distributor = '전체';
      $scope.query.state = '전체';
    };

    $scope.ResetTarget = function() {
      $scope.targetId = null;
      $scope.targetNick = null;
      $scope.targetHolder = null;
      $scope.targetSite = null;
      $scope.targetDistributor = null;
      $scope.targetCash = null;
      $scope.targetState = null;
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.List();
      $scope.SiteList();
      $scope.DistributorList();
      $scope.ResetTarget();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

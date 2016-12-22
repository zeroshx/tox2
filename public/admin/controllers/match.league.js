angular.module('Match')
  .controller('MatchLeagueCtrl', function($rootScope, $scope, $routeParams, $window, Upload, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/match/league';

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
      if ($rootScope.mainmenu[i].name === '매치') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '선택', '리그', '국가'
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
            $scope.targetName = $scope.docs[i].name;
            $scope.targetCountry = $scope.docs[i].country;
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
      $scope.file = null;
      $scope.validator.message = '';
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
          name: $scope.targetName,
          country: $scope.targetCountry
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
        $window.location.reload(true);
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
          country: $scope.targetCountry
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
        $window.location.reload(true);
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
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
        }
      }, function(err) {
        $window.location.reload(true);
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
        $window.location.reload(true);
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
      $scope.targetCountry = null;
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.ResetTarget();
      $scope.List();
    };


    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();

  });

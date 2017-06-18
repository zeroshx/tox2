angular.module('My')
  .controller('WithdrawalCtrl', function($rootScope, $scope, $routeParams, $filter, $window, CRUDService, PublicService, AuthService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/asset/withdrawal/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 10)
    };

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $scope.docs = [];

    $scope._refreshTimer = 0;

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
        Http CRUD setting
    ****************************************************************************/
    $scope.Create = function() {
      CRUDService.Create($scope.baseUrl).run({
        cash: $scope.targetCash
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.validator.message = '';
          $scope.List();
          $scope.ResetTarget();
          alert("신청하였습니다.");
          AuthService.Me();
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
        } else {
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.RenderList();
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
          $scope.validator.message = '';
        }
      }, function(err) {
        $window.location = '/';
      });
    };


    /****************************************************************************
        Etc Functions
    ****************************************************************************/

    $scope.SubmitWithdrawal = function() {
      $scope.Create();
    };

    $scope.Refresh = function() {
      PublicService.RefreshContorller.Run(60,
        function(remainTime) {
          $scope._refreshTimer = remainTime;
          $scope.$apply();
        },
        function() {
          $scope.List();
        });
    };

    $scope.Cash = function(size) {
      $scope.targetCash += size;
    };

    $scope.CashReset = function() {
      $scope.targetCash = 0;
    };

    $scope.RenderList = function() {
      // step 1. create memo shortcut
      for (m = 0; m < $scope.docs.length; m++) {
        $scope.docs[m].cashCurrency = $filter('number')($scope.docs[m].cash);
      }
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 10;
    };

    $scope.ResetTarget = function() {
      $scope.targetCash = null;
    };

    $scope.Reset = function() {
      $scope.List();
      $scope.ResetTarget();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();

        PublicService.RefreshContorller.Run();
  });

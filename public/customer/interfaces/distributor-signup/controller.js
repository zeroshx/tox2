/* Setup blank page controller */
angular.module('TOX2APP').controller('DistributorSignupCtrl', [
  '$rootScope', '$scope', '$state',
  'DistributorSignupService', 'PublicFactory', 'settings', 'init',
  function(
    $rootScope, $scope, $state,
    DistributorSignupService, PublicFactory, settings, init
  ) {

    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    if($rootScope.__GetUser('me').distributor && $rootScope.__GetUser('me').distributor.name) {
      return $state.go('distributor-info');
    }

    //***********************************************************************************************************
    //// Common Member Vars.
    $scope._path = init.path;
    $scope._query = init.query;
    $scope._breadcrumb = [{
      path: '',
      name: '총판',
      icon: 'icon-home'
    }, {
      path: 'distributor-signup',
      name: '가입',
      icon: 'icon-home'
    }];

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    $scope._cbLeader = false;

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope._StartLoading = function () {
      App.blockUI({
          target: '.page-content',
          overlayColor: 'none',
          animate: true
      });
    };

    $scope._EndLoading = function () {
      App.unblockUI('.page-content');
    };

    $scope._MovePage = function(page) {
      $scope._query.page = Number(page);
      $scope.List();
    };

    $scope._NextPage = function() {
      var page = Number($scope._query.page);
      var totalPage = Number($scope._pageCount);
      if (page < totalPage) {
        $scope._query.page = page + 1;
        $scope.List();
      }
    };

    $scope._PreviousPage = function() {
      var page = Number($scope._query.page);
      if ((page - 1) > 0) {
        $scope._query.page = page - 1;
        $scope.List();
      }
    };

    $scope._LastPage = function() {
      $scope._query.page = Number($scope._pageCount);
      $scope.List();
    };

    $scope._FirstPage = function() {
      $scope._query.page = 1;
      $scope.List();
    };


    //***********************************************************************************************************
    //// Local Vars.

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Join = function(doc) {
      $scope._StartLoading();
      DistributorSignupService.Join({
        distributor: doc._id
      }, function(data, defer) {
        if (data.failure) return defer.reject(data.failure);
        defer.resolve(data);
      })
      .then(function (data) {
        $scope._EndLoading();
        bootbox.alert(data.success, function () {
          if(data.type === 'member') {
            $state.go('distributor-info');
          }
        });
      })
      .catch(function (msg) {
        $scope._EndLoading();
        bootbox.alert(msg);
      });
    };

    $scope.List = function() {
      $scope._StartLoading();
      DistributorSignupService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.count, data.docs);
      });
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
      $scope._list = list;
    };

    $scope.Reset = function() {
      $scope.ResetQuery();
      $scope.List();
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
      $scope.query.searchKeyword = '';
      $scope.query.searchFilter = '';
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.count, init.data.docs);
  }
]);

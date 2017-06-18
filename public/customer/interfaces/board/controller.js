/* Setup blank page controller */
angular.module('TOX2APP').controller('BoardCtrl', [
  '$rootScope', '$scope', '$sce', '$state',
  'BoardService', 'PublicFactory', 'settings', 'init',
  function(
    $rootScope, $scope, $sce, $state,
    BoardService, PublicFactory, settings, init
  ) {
    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;

    });

    if (init.query.sort === '총판게시판') {
      if (!$rootScope.__GetUser('me').distributor || !$rootScope.__GetUser('me').distributor.name) {
        return $state.go('distributor-signup');
      }
    }

    //***********************************************************************************************************
    //// Common Member Vars.

    $scope._url = init.url;
    $scope._query = init.query;
    $scope._breadcrumb = [{
      path: '',
      name: '커뮤니티',
      icon: 'icon-home'
    }, init.breadcrumb];

    $scope._pageTitle = init.query.sort;

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope._StartLoading = function() {
      App.blockUI({
        target: '.page-content',
        overlayColor: 'none',
        animate: true
      });
    };

    $scope._EndLoading = function() {
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

    $scope.List = function() {
      $scope._StartLoading();
      BoardService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.count, data.docs);
      });
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._list = list;
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._url, $scope._query);
    };


    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.count, init.data.docs);
  }
]);

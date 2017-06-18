/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('AssetReportCtrl', [
  '$rootScope', '$scope',
  'AssetReportService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope,
    DepositService, PApi, settings, init
  ) {

    $scope.$on('$viewContentLoaded', function() {
      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = false;
      $rootScope.settings.layout.pageBodySolid = true;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //***********************************************************************************************************
    //// Common Member Vars.

    $scope._viewTitle = {
      text: '게임머니 내역',
      color: 'green'
    };
    $scope._searchFilter = ['닉네임', '아이디', '메모'];
    $scope._path = init.path;
    $scope._query = init.query;
    $scope._selectLeader = false;

    //***********************************************************************************************************
    //// Common Member Functions.



    //***********************************************************************************************************
    //// Local Vars.


    //***********************************************************************************************************
    //// Local Functions.

    $scope.List = function() {
      PApi.StartLoading();
      DepositService.List($scope._query, function(data) {
        if(data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._lastPage = lastPage;
    };

    $scope.SelectAll = function() {
      for (i in $scope._list) {
        if($scope._list[i]._cbExist) $scope._list[i]._cbSelected = $scope._selectLeader;
      }
    };

    $scope.GetSelectedList = function() {
      var list = [];
      for (i in $scope._list) {
        if ($scope._list[i]._cbSelected)
          list.push($scope._list[i]._id);
      }
      return list;
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

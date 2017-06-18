/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('DepositCtrl', [
  '$rootScope', '$scope',
  'DepositService', 'PApi', 'settings', 'init',
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
      text: '입금 관리',
      color: 'blue'
    };
    $scope._searchFilter = ['예금주', '닉네임', '아이디'];
    $scope._path = init.path;
    $scope._query = init.query;
    $scope._selectLeader = false;

    //***********************************************************************************************************
    //// Common Member Functions.



    //***********************************************************************************************************
    //// Local Vars.


    //***********************************************************************************************************
    //// Local Functions.

    $scope.Accept = function(id) {
      if(!PApi.IsValideString(id)) return;
      PApi.StartLoading();
      DepositService.Accept(
        id,
        function (data, defer) {
          if(data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      )
      .then(function (legacy) {
        return DepositService.List($scope._query, function(data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      })
      .then(function (legacy) {
        PApi.Alert('승인되었습니다.');
      })
      .catch(function (legacy) {
        PApi.Alert(legacy);
      })
      .finally(function () {
        PApi.EndLoading();
      });
    };

    $scope.BulkAccept = function() {
      var list = $scope.GetSelectedList();
      if(list.length === 0) return;
      PApi.StartLoading();
      var queue = DepositService.Accept(list[0]);
      for(var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function () {
            return DepositService.Accept(list[ii]);
          });
        })(i);
      }
      queue.then(function (legacy) {
        return DepositService.List($scope._query, function(data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function () {
        $scope._selectLeader = false;
        PApi.EndLoading();
        PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
      });
    };

    $scope.Cancel = function(id) {
      if(!PApi.IsValideString(id)) return;
      PApi.StartLoading();
      DepositService.Cancel(
        id,
        function (data, defer) {
          if(data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      )
      .then(function (legacy) {
        return DepositService.List($scope._query, function(data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      })
      .then(function (legacy) {
        PApi.Alert('취소되었습니다.');
      })
      .catch(function (legacy) {
        PApi.Alert(legacy);
      })
      .finally(function () {
        PApi.EndLoading();
      });
    };

    $scope.BulkCancel = function() {
      var list = $scope.GetSelectedList();
      if(list.length === 0) return;
      PApi.StartLoading();
      var queue = DepositService.Cancel(list[0]);
      for(var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function () {
            return DepositService.Cancel(list[ii]);
          });
        })(i);
      }
      queue.then(function (legacy) {
        return DepositService.List($scope._query, function(data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function () {
        $scope._selectLeader = false;
        PApi.EndLoading();
        PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
      });
    };

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

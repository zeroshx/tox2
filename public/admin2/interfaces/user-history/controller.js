/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('UserHistoryCtrl', [
  '$rootScope', '$scope',
  'UserHistoryService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope,
    UserHistoryService, PApi, settings, init
  ) {
    $scope.$on('$viewContentLoaded', function() {
      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = false;
      $rootScope.settings.layout.pageBodySolid = true;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //***********************************************************************************************************
    //// Common Member Vars.

    $scope._path = init.path;
    $scope._query = init.query;
    $scope._selectLeader = false;

    $scope._viewTitle = {
      header: '회원 관리',
      text: '접속기록',
      color: 'green-meadow'
    };

    $scope._searchFilter = ['아이디', '닉네임', '아이피', '도메인'];

    //***********************************************************************************************************
    //// Common Member Functions.

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

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._lastPage = lastPage;
    };

    //***********************************************************************************************************
    //// Local Vars.

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Black = function(doc) {
      PApi.StartLoading();
      UserHistoryService.Black({
        item: {
          type: '아이디',
          target: doc.uid,
          memo: '접속 기록에서 블랙'
        }
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return UserHistoryService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('블랙리스트에 추가되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Ban = function(doc) {
      PApi.StartLoading();
      UserHistoryService.Ban({
        item: {
          ip: doc.ip,
          memo: '접속 기록에서 차단'
        }
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return UserHistoryService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('아이피가 차단되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      UserHistoryService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

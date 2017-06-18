/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('IPBlockCtrl', [
  '$rootScope', '$scope',
  'IPBlockService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope,
    IPBlockService, PApi, settings, init
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
      text: '아이피 관리',
      color: 'yellow'
    };

    $scope._searchFilter = ['아이피', '메모'];

    $scope._item = {};

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '차단 아이피 등록',
        notice: '아이피 주소 형식에 맞게 입력 바랍니다. 예시) 192.168.0.12'
      },
      element: [{
        label: '아이피 주소',
        type: 'text',
        bind: '.ip',
        placeholder: 'xxx.xxx.xxx.xxx'
      }, {
        label: '메모',
        type: 'multi-text',
        bind: '.memo'
      }]
    };


    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = doc;
      $scope._detailViewFormat = [
        [{
          label: '아이피',
          type: 'text',
          value: doc.ip,
          width: [2, 10]
        }], [{
          label: '메모',
          type: 'multi-text',
          value: doc.memo,
          width: [2, 10]
        }], [{
          label: '등록 정보',
          type: 'text',
          value: doc.creator,
          width: [2, 5]
        }, {
          type: 'text',
          value: doc.createdAt,
          width: [0, 5]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        ip: '',
        memo: ''
      };
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

    $scope.CreateForm = function() {
      $scope.ResetFormModel();
      $scope._formSwitch = true;
      $scope._formAction = 'CREATE';
      PApi.ScrollTop();
    };

    $scope.ModifyForm = function(doc) {
      $scope._item = doc;
      $scope._formSwitch = true;
      $scope._formAction = 'MODIFY';
      PApi.ScrollTop();
    };

    $scope.CloseForm = function() {
      $scope._formSwitch = null;
      $scope._formAction = null;
    };

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._lastPage = lastPage;
    };

    //***********************************************************************************************************
    //// Local Vars.



    //***********************************************************************************************************
    //// Local Functions.

    $scope.Add = function() {
      PApi.StartLoading();
      IPBlockService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return IPBlockService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('등록이 완료되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Release = function(id) {
      if(!PApi.IsValidString(id)) return;
      PApi.StartLoading();
      IPBlockService.Release(
        id,
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return IPBlockService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('해제되었습니다.');
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.BulkRelease = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.StartLoading();
      var queue = IPBlockService.Release(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return IPBlockService.Release(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return IPBlockService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function() {
        $scope._selectLeader = false;
        PApi.EndLoading();
        PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      IPBlockService.List($scope._query, function(data) {
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

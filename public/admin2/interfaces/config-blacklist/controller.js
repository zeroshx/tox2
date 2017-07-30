/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('BlacklistCtrl', [
  '$rootScope', '$scope', '$filter',
  'BlacklistService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope, $filter,
    BlacklistService, PApi, settings, init
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

    $scope._item = {};

    $scope._viewTitle = {
      text: '블랙리스트 관리',
      color: 'red'
    };

    $scope._searchFilter = ['사이트', '닉네임', '아이디', '메모'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '블랙리스트 등록',
        notice: '등록 형식을 선택 후 해당하는 정보를 입력바랍니다.'
      },
      element: [{
        label: '등록 형식',
        type: 'button-group',
        bind: 'type',
        button: [{
          value: '아이디',
          class: 'green-soft'
        }, {
          value: '닉네임',
          class: 'blue-soft'
        }]
      }, {
        label: '아이디 또는 닉네임',
        type: 'text',
        bind: 'target'
      }, {
        label: '메모',
        type: 'multi-text',
        bind: 'memo'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
        [{
          label: '사이트',
          type: 'text',
          value: doc.site,
          width: [2, 10]
        }], [{
          label: '아이디',
          type: 'text',
          value: doc.uid,
          width: [2, 4]
        }, {
          label: '닉네임',
          type: 'text',
          value: doc.nick,
          width: [2, 4]
        }], [{
          label: '메모',
          type: 'multi-text',
          value: doc.memo,
          width: [2, 10]
        }], [{
          label: '등록 정보',
          type: 'text',
          value: doc.creator + '(' + $filter('datetime')(doc.createdAt) + ')',
          width: [2, 10]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        type: '아이디',
        target: '',
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
      $scope._item = angular.copy(doc);
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
      BlacklistService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return BlacklistService.List($scope._query, function(data, defer) {
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
      BlacklistService.Release(
        id,
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return BlacklistService.List(
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
      var queue = BlacklistService.Release(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return BlacklistService.Release(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return BlacklistService.List($scope._query, function(data, defer) {
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
      BlacklistService.List($scope._query, function(data) {
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

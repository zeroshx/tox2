/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('TestCtrl', [
  '$rootScope', '$scope', '$filter',
  'TestService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope, $filter,
    TestService, PApi, settings, init
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
      text: 'Test',
      color: 'red'
    };

    $scope._searchFilter = ['테스트'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '테스트 등록'
      },
      element: [{
        label: '아이디 또는 닉네임',
        type: 'text',
        bind: 'target'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
        [{
          label: '테스트2-1',
          type: 'text',
          value: 'test2-1ddddddddddddddddddddddddddddddddddddd',
          width: [2, 4]
        }, {
          label: '테스트2-2',
          type: 'text',
          value: 'test2-2',
          width: [2, 4]
        }], [{
          label: '테스트3-1',
          type: 'number',
          value: '100000000000',
          width: [2, 4]
        }, {
          label: '테스트3-2',
          type: 'text',
          value: 'test3-2',
          width: [2, 4]
        }], [{
          label: '테스트1-1',
          type: 'multi-text',
          value: 'test1-1ddddddddd',
          width: [2, 10]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        test: ''
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
      TestService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return TestService.List($scope._query, function(data, defer) {
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
      TestService.Release(
        id,
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return TestService.List(
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
      var queue = TestService.Release(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return TestService.Release(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return TestService.List($scope._query, function(data, defer) {
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
      TestService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    // $scope.RenderList(init.list.lastPage, init.list.docs);

    $scope._list = [{
      name: 'test1',
      order: 1
    }, {
      name: 'test2',
      order: 2
    }];

    $scope._test = 10;
  }
]);

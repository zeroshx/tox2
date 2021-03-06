/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('MatchKindCtrl', [
  '$rootScope', '$scope', '$filter',
  'MatchKindService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope, $filter,
    MatchKindService, PApi, settings, init,
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
      header: '매치',
      text: '종목 설정',
      color: 'red'
    };

    $scope._searchFilter = ['종목', '그룹'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '종목 등록'
      },
      element: [{
        label: '종목명',
        type: 'text',
        bind: 'name',
        readonly: 'MODIFY'
      }, {
        label: '종목 그룹',
        type: 'text',
        bind: 'group'
      }, {
        label: '이미지 업로드',
        type: 'image-upload',
        bind: 'image'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
        [{
          label: '종목',
          type: 'text',
          value: doc.name,
          width: [2, 4]
        }, {
          label: '종목 그룹',
          type: 'text',
          value: doc.group,
          width: [2, 4]
        }], [{
          label: '이미지 경로',
          type: 'text',
          value: doc.imagePath,
          width: [2, 10]
        }],  [{
          label: '이미지',
          type: 'image',
          value: doc.imagePath,
          width: [2, 10]
        }], [{
          label: '등록 일시',
          type: 'text',
          value: $filter('datetime')(doc.createdAt),
          width: [2, 10]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        name: '',
        group: ''
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
      MatchKindService.Add($scope._item, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return MatchKindService.List($scope._query, function(data, defer) {
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

    $scope.Modify = function() {
      PApi.StartLoading();
      MatchKindService.Modify($scope._item, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return MatchKindService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('수정되었습니다.');
        $scope.CloseForm();
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Remove = function(doc) {
      PApi.StartLoading();
      MatchKindService.Remove(doc._id, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return MatchKindService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('삭제되었습니다.');
        $scope.CloseForm();
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.BulkRemove = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.StartLoading();
      var queue = MatchKindService.Remove(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return MatchKindService.Remove(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return MatchKindService.List($scope._query, function(data, defer) {
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
      MatchKindService.List($scope._query, function(data) {
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

/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('SiteBettingCtrl', [
  '$rootScope', '$scope', '$filter',
  'SiteBettingService', 'PApi', 'settings', 'init', 'sites', 'kinds',
  function(
    $rootScope, $scope, $filter,
    SiteBettingService, PApi, settings, init, sites, kinds
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
      header: '사이트',
      text: '배팅 설정',
      color: 'green'
    };

    $scope._searchFilter = ['사이트'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '사이트 배팅 설정 등록'
      },
      element: [{
        label: '사이트',
        type: 'text-dropdown',
        bind: 'site',
        readonly: 'MODIFY',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: sites
        }
      }, {
        label: '배팅 취소 제한',
        type: 'unit-text-unit',
        bind: 'betCancelLimit',
        preUnit: '경기 시작',
        unit: '분 전까지'
      }, {
        label: '배팅 취소 횟수(일일)',
        type: 'text-unit',
        bind: 'betCancelCount',
        unit: '회'
      }, {
        label: '종목별 설정',
        type: 'kind-config',
        bind: 'kindConfig',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: kinds
        }
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
        }],
        [{
          label: '배팅 취소 제한',
          type: 'text',
          value: doc.betCancelLimit,
          unit: '분 전까지',
          width: [2, 4]
        }, {
          label: '배팅 취소 횟수',
          type: 'text',
          value: doc.betCancelCount,
          unit: '회 (일일)',
          width: [2, 4]
        }],
        [{
          label: '종목별 설정',
          type: 'kind-config',
          value: doc.kindConfig,
          width: [2, 10]
        }],
        [{
          label: '등록 정보',
          type: 'text',
          value: doc.creator + '(' + $filter('datetime')(doc.createdAt) + ')',
          width: [2, 10]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        site: '',
        betCancelCount: '3',
        betCancelLimit: '30',
        kindConfig: []
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
      $scope._formSwitch = false;
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
      SiteBettingService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return SiteBettingService.List($scope._query, function(data, defer) {
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
      SiteBettingService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return SiteBettingService.List(
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

    $scope.List = function() {
      PApi.StartLoading();
      SiteBettingService.List($scope._query, function(data) {
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

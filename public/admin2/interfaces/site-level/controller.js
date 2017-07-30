/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('SiteLevelCtrl', [
  '$rootScope', '$scope', '$filter',
  'SiteLevelService', 'PApi', 'settings', 'init', 'sites',
  function(
    $rootScope, $scope, $filter,
    SiteLevelService, PApi, settings, init, sites
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
      text: '레벨 설정',
      color: 'yellow'
    };

    $scope._searchFilter = ['레벨', '사이트'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '사이트 레벨 설정'
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
        label: '레벨명',
        type: 'text',
        bind: 'name',
        readonly: 'MODIFY'
      }, {
        label: '당첨 보너스(%)',
        type: 'spinner',
        bind: 'bonus.win'
      }, {
        label: '낙첨 보너스(%)',
        type: 'spinner',
        bind: 'bonus.lose'
      }, {
        label: '입금 보너스(%)',
        type: 'spinner',
        bind: 'bonus.charge'
      }, {
        label: '추천인 보너스(%)',
        type: 'spinner',
        bind: 'bonus.recommender'
      }, {
        label: '단일 배팅 최소액',
        type: 'text-unit',
        unit: '원',
        bind: 'single.minBet'
      }, {
        label: '단일 배팅 최대액',
        type: 'text-unit',
        unit: '원',
        bind: 'single.maxBet'
      }, {
        label: '단일 배팅 최대 배당',
        type: 'text',
        bind: 'single.maxRate'
      }, {
        label: '조합 배팅 최소액',
        type: 'text-unit',
        unit: '원',
        bind: 'multi.minBet'
      }, {
        label: '조합 배팅 최대액',
        type: 'text-unit',
        unit: '원',
        bind: 'multi.maxBet'
      }, {
        label: '조합 배팅 최대 배당',
        type: 'text',
        bind: 'multi.maxRate'
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
          width: [2, 4]
        }, {
          label: '레벨',
          type: 'text',
          value: doc.name,
          width: [2, 4]
        }],
        [{
          label: '당첨 보너스',
          type: 'text',
          value: doc.bonus.win,
          unit: '%',
          width: [2, 4]
        }, {
          label: '낙첨 보너스',
          type: 'text',
          value: doc.bonus.win,
          unit: '%',
          width: [2, 4]
        }],
        [{
          label: '입금 보너스',
          type: 'text',
          value: doc.bonus.charge,
          unit: '%',
          width: [2, 4]
        }, {
          label: '추천인 보너스',
          type: 'text',
          value: doc.bonus.recommender,
          unit: '%',
          width: [2, 4]
        }],
        [{
          label: '단일 최소액',
          type: 'number',
          value: doc.single.minBet,
          unit: '원',
          width: [2, 2]
        }, {
          label: '단일 최대액',
          type: 'number',
          value: doc.single.maxBet,
          unit: '원',
          width: [2, 2]
        }, {
          label: '단일 최대 배당',
          type: 'text',
          value: doc.single.maxRate,
          width: [2, 2]
        }],
        [{
          label: '조합 최소액',
          type: 'number',
          value: doc.multi.minBet,
          unit: '원',
          width: [2, 2]
        }, {
          label: '조합 최대액',
          type: 'number',
          value: doc.multi.maxBet,
          unit: '원',
          width: [2, 2]
        }, {
          label: '조합 최대 배당',
          type: 'text',
          value: doc.multi.maxRate,
          width: [2, 2]
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
        name: '',
        site: '',
        bonus: {
          win: '1',
          lose: '1',
          charge: '1',
          recommender: '1'
        },
        single: {
          minBet: '10000',
          maxBet: '1000000',
          maxRate: '20.00',
        },
        multi: {
          minBet: '30000',
          maxBet: '3000000',
          maxRate: '60.00',
        }
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
      SiteLevelService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return SiteLevelService.List($scope._query, function(data, defer) {
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
      SiteLevelService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return SiteLevelService.List(
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
      SiteLevelService.List($scope._query, function(data) {
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

/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('SiteCtrl', [
  '$rootScope', '$scope',
  'SiteService', 'PApi', 'settings', 'init', 'levels',
  function(
    $rootScope, $scope,
    SiteService, PApi, settings, init, levels
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
      header: '사이트',
      text: '기본 설정',
      color: 'red'
    };

    $scope._searchFilter = ['사이트', '메모', '사이트+메모'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '사이트 등록'
      },
      element: [{
        label: '사이트 상태',
        type: 'button-group',
        bind: '.state',
        button: [{
          value: '정지',
          class: 'red-soft'
        }, {
          value: '점검',
          class: 'yellow-crusta'
        }, {
          value: '정상',
          class: 'green-soft'
        }]
      }, {
        label: '사이트명',
        type: 'text',
        bind: '.name',
        readonly: 'MODIFY'
      }, {
        label: '메모',
        type: 'multi-text',
        bind: '.memo'
      }, {
        label: '당첨 보너스(%)',
        type: 'spinner',
        bind: '.bonus.win'
      }, {
        label: '낙첨 보너스(%)',
        type: 'spinner',
        bind: '.bonus.lose'
      }, {
        label: '첫입금 보너스(%)',
        type: 'spinner',
        bind: '.bonus.firstDeposit'
      }, {
        label: '입금 보너스(%)',
        type: 'spinner',
        bind: '.bonus.deposit'
      }, {
        label: '시작 레벨',
        type: 'text-dropdown',
        bind: '.config.level',
        dropdown: {
          class: 'btn-default',
          property: '_id',
          list: levels.docs
        }
      }, {
        label: '가입 캐시',
        type: 'text-unit',
        bind: '.config.cash',
        unit: 'C'
      }, {
        label: '가입 칩',
        type: 'text-unit',
        bind: '.config.chip',
        unit: 'G'
      }, {
        label: '가입 포인트',
        type: 'text-unit',
        bind: '.config.point',
        unit: 'P'
      }, {
        label: '안내 멘트',
        type: 'site-answer',
        bind: '.answer'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = doc;
      $scope._detailViewFormat = [
        [{
          label: '사이트명',
          type: 'text',
          value: doc.name,
          width: [2, 4]
        }, {
          label: '회원수',
          type: 'text',
          value: doc.headcount,
          width: [2, 4]
        }], [{
          label: '시작 레벨',
          type: 'text',
          value: doc.config.level,
          width: [2, 4]
        }, {
          label: '가입 캐시',
          type: 'number',
          value: doc.config.cash,
          unit: 'C',
          width: [2, 4]
        }], [{
          label: '가입 칩',
          type: 'number',
          value: doc.config.chip,
          unit: 'G',
          width: [2, 4]
        }, {
          label: '가입 포인트',
          type: 'number',
          value: doc.config.point,
          unit: 'P',
          width: [2, 4]
        }], [{
          label: '당첨 보너스',
          type: 'text',
          value: doc.bonus.win,
          unit: '%',
          width: [2, 4]
        }, {
          label: '낙첨 보너스',
          type: 'text',
          value: doc.bonus.lose,
          unit: '%',
          width: [2, 4]
        }], [{
          label: '첫입금 보너스',
          type: 'text',
          value: doc.bonus.firstDeposit,
          unit: '%',
          width: [2, 4]
        }, {
          label: '입금 보너스',
          type: 'number',
          value: doc.bonus.deposit,
          unit: '%',
          width: [2, 4]
        }], [{
          label: '메모',
          type: 'multi-text',
          value: doc.memo,
          width: [2, 10]
        }], [{
          label: '안내 멘트',
          type: 'site-answer',
          value: doc.answer,
          width: [2, 10]
        }], [{
          label: '최근 수정 정보',
          type: 'text',
          value: doc.modifier,
          width: [2, 5]
        }, {
          type: 'text',
          value: doc.modifiedAt,
          width: [0, 5]
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
        state: '정상',
        name: '',
        memo: '',
        bonus: {
          win: '3',
          lose: '3',
          firstDeposit: '3',
          deposit: '3'
        },
        config: {
          level: '1',
          cash: '5000',
          chip: '5000',
          point: '5000'
        },
        answer: []
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
      SiteService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return SiteService.List($scope._query, function(data, defer) {
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
      SiteService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return SiteService.List(
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
      SiteService.List($scope._query, function(data) {
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

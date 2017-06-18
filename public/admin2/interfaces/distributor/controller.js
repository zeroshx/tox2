/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('DistributorCtrl', [
  '$rootScope', '$scope',
  'DistributorService', 'PApi', 'settings', 'init', 'sites',
  function(
    $rootScope, $scope,
    DistributorService, PApi, settings, init, sites
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
      header: '총판',
      text: '기본 설정',
      color: 'red'
    };

    $scope._searchFilter = ['총판명', '총판장', '사이트', '메모'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '총판 등록'
      },
      element: [{
        label: '사이트',
        type: 'text-dropdown',
        bind: '.site',
        readonly: 'MODIFY',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: sites.docs
        }
      }, {
        label: '총판명',
        type: 'text',
        bind: '.name',
        readonly: 'MODIFY'
      }, {
        label: '총판장 아이디',
        type: 'text',
        bind: '.manager.uid'
      }, {
        label: '메모',
        type: 'multi-text',
        bind: '.memo'
      }, {
        label: '가입 방식',
        type: 'button-group',
        bind: '.joinStyle',
        button: [{
          value: '승인',
          class: 'green-soft'
        }, {
          value: '자유',
          class: 'blue-soft'
        }, {
          value: '비공개',
          class: 'red-soft'
        }]
      }, {
        label: '당첨 보너스(%)',
        type: 'spinner',
        bind: '.bonus.win'
      }, {
        label: '낙첨 보너스(%)',
        type: 'spinner',
        bind: '.bonus.lose'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = doc;
      $scope._detailViewFormat = [
        [{
          label: '사이트',
          type: 'text',
          value: doc.site,
          width: [2, 4]
        }, {
          label: '총판',
          type: 'text',
          value: doc.name,
          width: [2, 4]
        }], [{
          label: '총판장(아이디)',
          type: 'text',
          value: doc.manager.nick + '(' + doc.manager.uid + ')',
          width: [2, 4]
        }, {
          label: '회원수',
          type: 'text',
          value: doc.headcount,
          width: [2, 4]
        }], [{
          label: '가입 방식',
          type: 'text',
          value: doc.joinStyle,
          width: [2, 4]
        }, {
          label: '스탯 포인트',
          type: 'text',
          value: doc.statusPoint,
          width: [2, 4]
        }], [{
          label: '총판 레벨',
          type: 'text',
          value: doc.level,
          width: [2, 4]
        }, {
          label: '총판 경험치',
          type: 'number',
          value: doc.contribution,
          unit: 'EXP',
          width: [2, 4]
        }], [{
          label: '당첨 보너스',
          type: 'text',
          value: doc.bonus.win,
          unit: '%',
          width: [2, 4]
        }, {
          label: '낙첨 보너스',
          type: 'number',
          value: doc.bonus.win,
          unit: '%',
          width: [2, 4]
        }], [{
          label: '메모',
          type: 'multi-text',
          value: doc.memo,
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
        name: '',
        site: '',
        manager: {
          uid: ''
        },
        memo: '',
        joinStyle: '승인',
        bonus: {
          win: '3',
          lose: '3'
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
      DistributorService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return DistributorService.List($scope._query, function(data, defer) {
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
      DistributorService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return DistributorService.List(
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
      DistributorService.List($scope._query, function(data) {
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

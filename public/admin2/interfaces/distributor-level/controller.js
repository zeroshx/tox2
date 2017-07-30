/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('DistributorLevelCtrl', [
  '$rootScope', '$scope',
  'DistributorLevelService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope,
    DistributorLevelService, PApi, settings, init,
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
      text: '레벨 설정',
      color: 'purple'
    };

    $scope._searchFilter = ['레벨명'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '총판 레벨 등록'
      },
      element: [{
        label: '레벨명',
        type: 'text',
        bind: 'name',
        readonly: 'MODIFY'
      }, {
        label: '레벨 등급',
        type: 'text',
        bind: 'order',
        readonly: 'MODIFY',
        placeholder: '레벨의 등급, 1부터 클수록 상위레벨'
      }, {
        label: '최대회원제한',
        type: 'text',
        bind: 'maxHeadcount',
        placeholder: '현재 레벨에서 받을 수 있는 최대 총판 회원수'
      }, {
        label: '스탯포인트',
        type: 'text',
        bind: 'statusPoint',
        placeholder: '현재 레벨에서 총판 보너스에 투자할 수 있는 포인트'
      }, {
        label: '레벨업 요구치',
        type: 'text',
        bind: 'requirement',
        placeholder: '다음 레벨로 넘어가기 위한 필요양'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
        [{
          label: '레벨',
          type: 'text',
          value: doc.name + '(' + doc.order + ')',
          width: [2, 4]
        }, {
          label: '최대회원제한',
          type: 'text',
          value: doc.maxHeadcount,
          width: [2, 4]
        }],
        [{
          label: '스탯포인트',
          type: 'text',
          value: doc.statusPoint,
          width: [2, 4]
        }, {
          label: '레벨업 요구치',
          type: 'text',
          value: doc.requirement,
          width: [2, 4]
        }]
      ];
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        name: '',
        order: '',
        maxHeadcount: '',
        statusPoint: '',
        requirement: ''
      };
    };

    $scope.SelectAll = function() {
      for (i in $scope._list) {
        if ($scope._list[i]._cbExist) $scope._list[i]._cbSelected = $scope._selectLeader;
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
      DistributorLevelService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return DistributorLevelService.List($scope._query, function(data, defer) {
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
      DistributorLevelService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return DistributorLevelService.List(
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

    $scope.Remove = function(id) {
      PApi.Confirm('정말 삭제하시겠습니까?')
        .then(function(legacy) {
          PApi.StartLoading();
          return DistributorLevelService.Remove(
            id,
            function(data, defer) {
              if (data.failure) return defer.reject(data.failure);
              defer.resolve();
            });
        }).then(function(legacy) {
          return DistributorLevelService.List(
            $scope._query,
            function(data, defer) {
              if (data.failure) return defer.reject(data.failure);
              $scope.RenderList(data.lastPage, data.docs);
              defer.resolve();
            });
        }).then(function(legacy) {
          PApi.Alert('삭제되었습니다.');
        }).catch(function(legacy) {
          PApi.Alert(legacy);
        }).finally(function() {
          PApi.EndLoading();
        });
    };

    $scope.BulkRemove = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.Confirm('선택한 ' + list.length + '개를 모두 삭제하시겠습니까?', function (ok) {
        if(ok) {
          PApi.StartLoading();
          var queue = DistributorLevelService.Remove(list[0]);
          for (var i = 1; i < list.length; i++) {
            (function(ii) {
              queue = queue.then(function() {
                return DistributorLevelService.Remove(list[ii]);
              });
            })(i);
          }
          queue.then(function(legacy) {
            return DistributorLevelService.List($scope._query, function(data, defer) {
              if (data.failure) return defer.reject(data.failure);
              $scope.RenderList(data.lastPage, data.docs);
              defer.resolve();
            });
          }).finally(function() {
            $scope._selectLeader = false;
            PApi.EndLoading();
            PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
          });
        }
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      DistributorLevelService.List($scope._query, function(data) {
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

/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('MatchCtrl', [
  '$rootScope', '$scope', '$filter',
  'MatchService', 'PApi', 'settings', 'init', 'kinds', 'leagues',
  function(
    $rootScope, $scope, $filter,
    MatchService, PApi, settings, init, kinds, leagues
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
      text: '기본 설정',
      color: 'green-meadow'
    };

    $scope._searchFilter = ['친정팀', '원정팀', '리그'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '매치 등록'
      },
      element: [{
        label: '매치 상태',
        type: 'button-group',
        bind: 'state',
        button: [{
          value: '대기',
          class: 'blue-soft'
        }, {
          value: '배팅',
          class: 'green-soft'
        }, {
          value: '마감',
          class: 'yellow'
        }],
        hide: {
          mode: 'MODIFY'
        }
      }, {
        label: '매치 형식',
        type: 'text-dropdown',
        bind: 'mtype',
        inputOnlyDropdown: true,
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: [{
            name: '스포츠'
          }, {
            name: '버라이어티'
          }]
        }
      }, {
        label: '종목',
        type: 'text-dropdown',
        bind: 'kind',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: kinds
        }
      }, {
        label: '리그',
        type: 'select',
        bind: 'league',
        select: {
          property: 'name',
          list: leagues
        }
      }, {
        label: '매치 일시',
        type: 'datetime',
        bind: 'schedule'
      }, {
        label: '친정/원정 팀명',
        type: 'text-text',
        bind: ['content[0].name', 'content[1].name'],
        placeholder: ['(친정팀)', '(원정팀)'],
        hide: {
          target: 'mtype',
          operator: '!==',
          value: '스포츠'
        }
      }, {
        label: '매치명',
        type: 'text',
        bind: 'content[2].name',
        placeholder: '매치 내용',
        hide: {
          target: 'mtype',
          operator: '===',
          value: '스포츠'
        }
      }, {
        label: '마켓',
        type: 'match-market',
        bind: 'market'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
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
        state: '대기',
        mtype: '스포츠',
        kind: '',
        league: '',
        schedule: new Date(),
        content: [{
          status: 'HOME',
          name: ''
        }, {
          status: 'AWAY',
          name: ''
        }, {
          status: 'VARIETY',
          name: ''
        }],
        market: [{
          name: 'OOO VS OOO 승무패 게임 패키지',
          btype: '일반',
          game: [{
            show: true,
            offset: '',
            pick: [{
              name: '친정승',
              rate: '00.00'
            }, {
              name: '무승부',
              rate: '00.00'
            }, {
              name: '원정승',
              rate: '00.00'
            }]
          }]
        }]
      };
    };

    $scope.SelectAll = function() {
      for (i in $scope._list) {
        if ($scope._list[i]._cbExist) $scope._list[i]._cbSelected = $scope._selectLeader;
      }
    };

    $scope.ReleaseAll = function() {
      $scope._selectLeader = false;
      $scope.SelectAll();
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
      $scope._item.schedule = new Date($scope._item.schedule);
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
      MatchService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return MatchService.List($scope._query, function(data, defer) {
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
      MatchService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return MatchService.List(
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

    $scope.ChangeState = function(state) {
      var list = $scope.GetSelectedList();
      if(list.length === 0) return;
      var result = [];
      PApi.StartLoading();
      var queue = MatchService.ChangeState({id: list[0], state: state}, result);
      for(var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function () {
            return MatchService.ChangeState({id: list[ii], state: state}, result);
          });
        })(i);
      }
      queue.then(function (legacy) {
        return MatchService.List($scope._query, function(data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function () {
        $scope._selectLeader = false;
        PApi.EndLoading();
        var msg = '';
        if(result.length > 0) {
          for(i = 0; i < result.length; i++) {
            msg += result[i].msg + '(ID: ' + result[i].id + ')<br>';
          }
        } else {
          msg = '처리가 완료되었습니다. 결과는 리스트에서 확인하세요.';
        }
        PApi.Alert(msg);
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      MatchService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    $scope.OpenResultMode = function (idx) {
      $scope._list[idx]._show = true;
      $scope._actionMode = 'GROUP_RESULT';
      $scope._list[idx]._cbSelected = true;
    };

    $scope.OpenGroupResultMode = function () {
      var cnt = 0;
      for (i in $scope._list) {
        if ($scope._list[i]._cbSelected) {
            $scope._list[i]._show = true;
            cnt++;
        }
      }
      if(cnt > 0) {
        $scope._actionMode = 'GROUP_RESULT';
      }
    };

    $scope.CancelGroupResultMode = function () {
      $scope._actionMode = null;
      $scope.ReleaseAll();
      for (i in $scope._list) {
        $scope._list[i]._show = false;
      }
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

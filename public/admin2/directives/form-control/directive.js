angular.module('TOX2ADMINAPP')
  .directive('formControl', function() {

    var _basePath = 'directives/form-control';

    return {
      templateUrl: _basePath + '/view.html',
      restrict: 'AE',
      scope: {
        _item: '=itemBind',
        _formFormat: '=formatBind',
        _formSwitch: '=switchBind',
        _formAction: '=actionBind',
        _createFunction: '=createFunctionBind',
        _modifyFunction: '=modifyFunctionBind',
        _cancelFunction: '=cancelFunctionBind'
      },
      link: function(scope, element, attrs) {

      },
      controller: ['$rootScope', '$scope', 'PApi', function($rootScope, $scope, PApi) {

        $scope.dateOptions = {
          formatDay: 'd',
          formatMonth: 'M',
          formatDayTitle: 'yyyy년 M월',
          showWeeks: false
        };

        $scope.Create = function() {
          $scope._createFunction();
        };

        $scope.Modify = function() {
          $scope._modifyFunction();
        };

        $scope.Close = function() {
          $scope._cancelFunction();
        };

        $scope.Hide = function(target, operator, value, mode) {
          if(mode) {
            return $scope._formAction === mode;
          }
          if(!target || !operator || !value) return false;
          var paths = target.split('.');
          var cursor = $scope._item;
          for (i = 0; i < paths.length; ++i) {
            if(cursor[paths[i]] === undefined || typeof cursor[paths[i]] ==! 'object') return false;
            cursor = cursor[paths[i]];
          }
          if(operator === '===') {
            return cursor === value;
          } else if(operator === '!==') {
            return cursor !== value;
          }
        };

        $scope.GetButtonClass = function(group, elem, value) {
          if (elem !== value) return 'btn-default';
          for (var i = 0; i < group.length; i++) {
            if (group[i].value === value) {
              return group[i].class;
            }
          }
        };

        $scope.GetReadonly = function(value) {
          if (value === $scope._formAction) return true;
          else return false;
        };

        $scope.SpinnerUp = function(elem) {
          var paths = elem.split('.');
          var cursor = $scope._item;
          for (i = 0; i < paths.length; ++i) {
            if (cursor[paths[i]] !== undefined) {
              if (i !== paths.length - 1) {
                cursor = cursor[paths[i]];
              } else {
                var e = parseInt(cursor[paths[i]]);
                if (isNaN(e)) {
                  return cursor[paths[i]] = 0;
                }
                if (e < 100) e++;
                cursor[paths[i]] = String(e);
              }
            }
          }
        };

        $scope.SpinnerDown = function(elem) {
          var paths = elem.split('.');
          var cursor = $scope._item;
          for (i = 0; i < paths.length; ++i) {
            if (cursor[paths[i]] !== undefined) {
              if (i !== paths.length - 1) {
                cursor = cursor[paths[i]];
              } else {
                var e = parseInt(cursor[paths[i]]);
                if (isNaN(e)) {
                  return cursor[paths[i]] = 0;
                }
                if (e > 0) e--;
                cursor[paths[i]] = String(e);
              }
            }
          }
        };

        $scope.PushSiteAnswer = function() {
          if (!Array.isArray($scope._item.answer)) {
            $scope._item.answer = [];
          }
          $scope._item.answer.push({
            action: null,
            title: null,
            content: null
          });
        };

        $scope.PopSiteAnswer = function(idx) {
          $scope._item.answer.splice(idx, 1);
        };

        $scope.PushKindConfig = function() {
          if (!Array.isArray($scope._item.kindConfig)) {
            $scope._item.kindConfig = [];
          }
          $scope._item.kindConfig.push({
            name: '',
            maxMulti: '3',
            nah: true,
            nau: true,
            hau: true
          });
        };

        $scope.PopKindConfig = function(idx) {
          $scope._item.kindConfig.splice(idx, 1);
        };

        $scope.PushMatchPick = function(gm) {
          gm.pick.push({
            name: '',
            rate: ''
          });
        };

        $scope.PopMatchPick = function(gm) {
          if(gm.pick.length <= 2) return;
          gm.pick.splice(gm.pick.length - 1, 1);
        };

        $scope.PushMatchGame = function(mt, idx) {
          mt.game.push({
            show: true,
            offset: '',
            pick: [{
              name: '',
              rate: ''
            }, {
              name: '',
              rate: ''
            }]
          });
        };

        $scope.PopMatchGame = function(mt, idx) {
          mt.game.splice(idx, 1);
          if(mt.game.length === 0) {
            var lth = $scope._item.market.length;
            for(i = 0; i < lth; i++) {
              if($scope._item.market[i].game.length === 0) {
                $scope._item.market.splice(i, 1);
              }
            }
          }
        };

        $scope.PushMatchMarket = function() {
          $scope._item.market.push({
            name: '',
            btype: '',
            game: [{
              show: true,
              offset: '',
              pick: [{
                name: '',
                rate: ''
              }, {
                name: '',
                rate: ''
              }]
            }]
          });
        };

        $scope.PopMatchMarket = function(idx) {
          $scope._item.market.splice(idx, 1);
        };

        $scope.SelectMatchMarketType = function(market, value) {
          if($scope._item.mtype === '버라이어티' && value !== '일반') {
            return PApi.Alert('버라이어티 매치는 일반 형식의 게임만 지원합니다.');
          }
          market.btype = value;
        };

        $scope.Debug = function() {
          console.log($scope._item);
        };

      }]
    };
  });

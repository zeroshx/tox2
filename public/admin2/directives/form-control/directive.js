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
      controller: ['$rootScope', '$scope', 'CRUDFactory', function($rootScope, $scope, CRUDFactory) {

        $scope.Create = function() {
          $scope._createFunction();
        };

        $scope.Modify = function() {
          $scope._modifyFunction();
        };

        $scope.Close = function() {
          $scope._cancelFunction();
        };

        $scope.GetButtonClass = function(group, elem, value) {
          if (elem !== value) return 'btn-default';
          for (var i = 0; i < group.length; i++) {
            if (group[i].value === value) {
              return group[i].class;
            }
          }
        };

        $scope.SpinnerUp = function(elem) {
          var paths = elem.split('.');
          var cursor = $scope._item;
          for (i = 1; i < paths.length; ++i) {
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
          for (i = 1; i < paths.length; ++i) {
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
          if(!Array.isArray($scope._item.answer)) {
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
          if(!Array.isArray($scope._item.kindConfig)) {
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

      }]
    };
  });

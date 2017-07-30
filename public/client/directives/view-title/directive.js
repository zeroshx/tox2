angular.module('TOX2APP')
  .directive('viewTitle', function() {

    var _basePath = 'directives/view-title/';

    return {
      templateUrl: _basePath + 'view.html',
      restrict: 'AE',
      scope: {
        _viewTitle: '=titleInfoBind'
      },
      controller: ['$scope', function ($scope) {
      }]
    };
  });

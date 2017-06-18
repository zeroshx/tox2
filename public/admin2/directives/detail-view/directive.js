angular.module('TOX2ADMINAPP')
  .directive('detailView', function() {

    var _basePath = 'directives/detail-view';

    return {
      templateUrl: _basePath + '/view.html',
      restrict: 'AE',
      scope: {
        _detailViewFormat: '=detailViewFormatBind'
      },
      link: function(scope, element, attrs) {

      },
      controller: ['$rootScope', '$scope', 'CRUDFactory', function($rootScope, $scope, CRUDFactory) {

        
      }]
    };
  });

/* Setup Layout Part - Theme Panel */
angular.module("TOX2ADMINAPP")
  .controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
      Demo.init(); // init theme panel
    });
  }]);

/* Setup Layout Part - Header */
angular.module("TOX2ADMINAPP")
  .controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
      Layout.initHeader(); // init header
    });
  }]);

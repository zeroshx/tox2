/* Setup Layout Part - Header */
angular.module("TOX2APP")
  .controller('HeaderController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initHeader(); // init header
  });
}]);

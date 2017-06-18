/* Setup Layout Part - Quick Sidebar */
angular.module("TOX2APP")
  .controller('QuickSidebarController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    setTimeout(function() {
      QuickSidebar.init(); // init quick sidebar
    }, 2000)
  });
}]);

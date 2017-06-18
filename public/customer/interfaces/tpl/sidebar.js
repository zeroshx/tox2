/* Setup Layout Part - Sidebar */
angular.module("TOX2APP")
  .controller('SidebarController', ['$state', '$scope', function($state, $scope) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initSidebar($state); // init sidebar
  });
}]);

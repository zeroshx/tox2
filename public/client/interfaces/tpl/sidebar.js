/* Setup Layout Part - Sidebar */
angular.module("TOX2APP")
  .controller('SidebarController', ['$state', '$scope', '$rootScope', function($state, $scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
      Layout.initSidebar($state); // init sidebar
    });

    $scope.menu = $rootScope.__GetLegacy('menu');

  }]);

/* Setup Layout Part - Footer */
angular.module("TOX2APP")
  .controller('ErrorCtrl', [
    '$scope', '$rootScope',
    function($scope, $rootScope) {

      $scope.$on('$viewContentLoaded', function() {
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
      });

    }
  ]);

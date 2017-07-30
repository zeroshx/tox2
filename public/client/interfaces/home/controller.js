/* Setup Layout Part - Footer */
angular.module("TOX2APP")
  .controller('HomeCtrl', [
    '$scope', '$rootScope', 'PApi',
    function($scope, $rootScope, PApi) {

      $scope.$on('$viewContentLoaded', function() {
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
      });


    }
  ]);

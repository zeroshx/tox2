/* Setup blank page controller */
angular.module('TOX2APP').controller('HomeCtrl', ['$rootScope', '$scope', 'settings',
function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $rootScope.__DeleteLegacy();
}]);

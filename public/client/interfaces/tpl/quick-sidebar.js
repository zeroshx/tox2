/* Setup Layout Part - Quick Sidebar */
angular.module("TOX2APP")
  .controller('QuickSidebarController', ['$rootScope', '$scope', '$timeout', 'CRUDFactory', 'PApi',
    function($rootScope, $scope, $timeout, CRUDFactory, PApi) {
      $scope.$on('$includeContentLoaded', function() {
        $timeout(function() {
          QuickSidebar.init(); // init quick sidebar
        }, 3000);
      });


    }
  ]);

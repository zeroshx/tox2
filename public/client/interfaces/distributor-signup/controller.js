/* Setup blank page controller */
angular.module('TOX2APP').controller('DistributorSignupCtrl', [
  '$rootScope', '$scope',
  'DistributorSignupService', 'PApi', 'settings',
  function(
    $rootScope, $scope,
    DistributorSignupService, PApi, settings
  ) {

    $scope.$on('$viewContentLoaded', function() {
      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = false;
      $rootScope.settings.layout.pageBodySolid = true;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //***********************************************************************************************************
    //// Common Member Vars.


    //***********************************************************************************************************
    //// Common Member Functions.



    //***********************************************************************************************************
    //// Local Vars.


    //***********************************************************************************************************
    //// Local Functions.


  }
]);

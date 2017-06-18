/* Setup Layout Part - Footer */
angular.module("TOX2ADMINAPP")
  .controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
      Layout.initFooter(); // init footer
    });
  }]);

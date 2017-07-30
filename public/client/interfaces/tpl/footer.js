/* Setup Layout Part - Footer */
angular.module("TOX2APP")
  .controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
      Layout.initFooter(); // init footer
    });
  }]);

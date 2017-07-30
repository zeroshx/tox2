/* Setup Layout Part - Header */
angular.module("TOX2APP")
  .controller('HeaderController', ['$rootScope', '$scope', '$interval', '$timeout', '$q', 'ngAudio', 'CRUDFactory',
    function($rootScope, $scope, $interval, $timeout, $q, ngAudio, CRUDFactory) {
      $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
      });

    }
  ]);

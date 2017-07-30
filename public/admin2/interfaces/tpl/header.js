/* Setup Layout Part - Header */
angular.module("TOX2ADMINAPP")
  .controller('HeaderController', ['$rootScope', '$scope', '$interval', '$timeout', '$q', 'ngAudio', 'CRUDFactory',
    function($rootScope, $scope, $interval, $timeout, $q, ngAudio, CRUDFactory) {
      $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
      });

      $scope._vars = {
        delay: 0,
        notification: {
          deposit: 0,
          withdrawal: 0,
          question: 0
        },
        notificationFlag: true,
        notificationSoundFlag: true
      };

      $scope.notificationMusic = ngAudio.load('../sounds/notification.mp3');

      $scope.PlayNotificationMusic = function() {
        var soundOn = false;
        for (var key in $scope._vars.notification) {
          if ($scope._vars.notification[key] > 0) {
            soundOn = true;
          }
        }
        if (soundOn && $scope._vars.notificationSoundFlag) {
          $scope.notificationMusic.play();
        }
      };

      $scope.CheckNotification = function(type) {
        var current = $rootScope.$state.current.name;
        if (type === 'deposit' && current === 'asset-deposit') {
          $rootScope.__DepositList();
        } else if (type === 'withdrawal' && current === 'asset-withdrawal') {
          $rootScope.__WithdrawalList();
        } else if (type === 'question' && current === 'community-question') {
          $rootScope.__QuestionList();
        }
        $scope._vars.notification[type] = 0;
      };

      $scope.SetNotification = function (flag) {
        $scope._vars.notificationFlag = flag;
      };

      $scope.SetNotificationSound = function (flag) {
        $scope._vars.notificationSoundFlag = flag;
      };

      $interval(function() {
        if ($scope._vars.delay === 10) {
          if ($scope._vars.notificationFlag) {
            CRUDFactory.READ(
              '/config/manager/realtime', {},
              function(data) {
                $scope._vars.notification = data;
                $scope.PlayNotificationMusic();
              });
          }
          $scope._vars.delay = 0;
        } else {
          $scope._vars.delay++;
        }
      }, 1000);


    }
  ]);

/* Setup blank page controller */
angular.module('TOX2APP').controller('DistributorSetupCtrl', [
  '$rootScope', '$scope', '$state',
  'DistributorSetupService', 'PublicFactory', 'settings', 'init', 'config',
  function(
    $rootScope, $scope, $state,
    DistributorSetupService, PublicFactory, settings, init, config
  ) {

    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    if($rootScope.__GetUser('me').distributor && $rootScope.__GetUser('me').distributor.name) {
      return $state.go('distributor-info');
    }

    //***********************************************************************************************************
    //// Common Member Vars.
    $scope._path = init.path;
    $scope._breadcrumb = [{
      path: '',
      name: '총판',
      icon: 'icon-home'
    }, {
      path: 'distributor-setup',
      name: '생성',
      icon: 'icon-home'
    }];

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope._StartLoading = function () {
      App.blockUI({
          target: '.page-content',
          overlayColor: 'none',
          animate: true
      });
    };

    $scope._EndLoading = function () {
      App.unblockUI('.page-content');
    };

    //***********************************************************************************************************
    //// Local Vars.
    $scope.targetConfig = config.data;

    //***********************************************************************************************************
    //// Local Functions.

    $scope.CreateDistributor = function(doc) {
      $scope._StartLoading();
      DistributorSetupService.CreateDistributor({
        name: $scope.targetName,
        memo: $scope.targetMemo,
        joinStyle: $scope.targetJoinStyle,
        bonusWin: $scope.targetBonusWin,
        bonusLose: $scope.targetBonusLose
      }, function(data, defer) {
        if (data.failure) return defer.reject(data.failure);
        defer.resolve();
      })
      .then(function () {
        $scope._EndLoading();
        bootbox.alert('생성하였습니다. 총판 정보 페이지로 이동합니다.', function () {
          $state.go('distributor-info');
        });
      })
      .catch(function (msg) {
        $scope._EndLoading();
        bootbox.alert(msg);
      });
    };

    $scope.SetSignupStyle = function(style) {
      $scope.targetJoinStyle = style;
    };

    $scope.Plus = function(type) {
      if($scope.targetConfig.statusPoint === 0) return;
      if(type==='WIN') $scope.targetBonusWin++;
      else if(type==='LOSE') $scope.targetBonusLose++;
      $scope.targetConfig.statusPoint--;
    };

    $scope.Minus = function(type) {
      if(type==='WIN' && $scope.targetBonusWin !== 0) {
        $scope.targetBonusWin--;
      }
      else if(type==='LOSE' && $scope.targetBonusLose !== 0) {
        $scope.targetBonusLose--;
      } else {
        return;
      }
      $scope.targetConfig.statusPoint++;
    };

    $scope.ResetTarget = function() {
      $scope.targetName = null;
      $scope.targetMemo = null;
      $scope.targetJoinStyle = '승인';
      $scope.targetBonusWin = 0;
      $scope.targetBonusLose = 0;
    };
    //***********************************************************************************************************
    //// Init Call Functions.

    $scope.ResetTarget();
  }
]);

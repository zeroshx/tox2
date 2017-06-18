angular.module('Distributor')
  .controller('DistributorSetupCtrl', function($rootScope, $scope, $window, $location, CRUDService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/distributor/customer';


    /****************************************************************************
        Http CRUD setting
    ****************************************************************************/

    $scope.Config = function() {
      CRUDService.Read($scope.baseUrl + '/config').run({}, function(res) {
        if(res.failure) return alert(res.failure);
        $scope.targetConfig = res;
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Create = function() {
      CRUDService.Create($scope.baseUrl).run({
        name: $scope.targetName,
        memo: $scope.targetMemo,
        joinStyle: $scope.targetJoinStyle,
        bonusWin: $scope.targetBonusWin,
        bonusLose: $scope.targetBonusLose
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert("등록하였습니다.");
        $location.url('/distributor/info');
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/
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
      $scope.targetJoinStyle = null;
      $scope.targetBonusWin = 0;
      $scope.targetBonusLose = 0;
    };

    $scope.Reset = function() {
      $scope.ResetTarget();
      $scope.Config();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

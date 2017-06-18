angular.module('TOX2ADMINAPP')
  .controller('ManagerCtrl', function($rootScope, $scope, $routeParams, $window, $anchorScroll, CRUDService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/config/manager';

    /****************************************************************************
        Sub Menu setting
    ****************************************************************************/
    for (var i in $rootScope.mainmenu) {
      if ($rootScope.mainmenu[i].name === '설정') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }

    $scope.One = function() {
      CRUDService.Read($scope.baseUrl).run({}, function(res) {
        if (res.failure) {
          $scope.target = {
            distributor: {
              level: []
            }
          };
          return alert(res.failure);
        }
        $scope.target = res;
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Upsert = function() {
      console.log($scope.target);
      CRUDService.Create($scope.baseUrl).run({
        target: $scope.target
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert('저장되었습니다.');
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/

    $scope.AddDistributorLevel = function() {
      $scope.target.distributor.level.push({
        name:$scope.targetLevel.name,
        requirement:$scope.targetLevel.requirement,
        maxHeadCount:$scope.targetLevel.maxHeadCount,
        statusPoint:$scope.targetLevel.statusPoint
      });
      $scope.targetLevel = null;
    };

    $scope.RemoveDistributorLevel = function(index) {
      $scope.target.distributor.level.splice(index, 1);
    };

    $scope.ResetTarget = function() {
      $scope.target = null;
      $scope.targetLevel = null;
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.ResetTarget();
    $scope.One();
  });

angular.module('Config')
  .controller('ManagerCtrl', function($rootScope, $scope, $routeParams, $window, CRUDService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/config/manager';

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $scope.docs = [];

    /****************************************************************************
        Sub Menu setting
    ****************************************************************************/
    for (var i in $rootScope.mainmenu) {
      if ($rootScope.mainmenu[i].name === '설정') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run({}, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $scope.docs = [];
        } else {
          $scope.docs = res.docs;
          $scope.validator.message = '';
          $scope.RenderList();
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Create = function() {
      CRUDService.Create($scope.baseUrl).run({
        bonusPhone: $scope.targetBonusPhone,
        bonusEmail: $scope.targetBonusEmail
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.validator.message = '';
          $scope.List();
          alert('저장되었습니다.');
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl, $scope.targetId).run({
        bonusPhone: $scope.targetBonusPhone,
        bonusEmail: $scope.targetBonusEmail
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.validator.message = '';
          $scope.List();
          alert('저장되었습니다.');
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/
    $scope.RenderList = function() {
      if($scope.docs.length !== 0) {
        $scope.targetId = $scope.docs[0]._id;
        $scope.targetBonusPhone = $scope.docs[0].bonus.phone;
        $scope.targetBonusEmail = $scope.docs[0].bonus.email;
      }
    };

    $scope.Save = function() {
      if($scope.docs.length !== 0) {
        $scope.Update();
      } else {
        $scope.Create();
      }
    };

    $scope.ResetTarget = function() {
      $scope.targetId = null;
      $scope.targetBonusPhone = null;
      $scope.targetBonusEmail = null;
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.ResetTarget();
    $scope.List();
  });

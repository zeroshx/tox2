angular.module('TOX2ADMINAPP')
  .controller('TodoCtrl', function($rootScope, $scope, $routeParams, $window, $anchorScroll, CRUDService) {

    $scope.baseUrl = '/todo';

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $rootScope.submenu = null;

    $scope.docs = [];

    /****************************************************************************
        Http CRUD setting
    ****************************************************************************/
    $scope.Create = function() {
      CRUDService.Create($scope.baseUrl).run({
        importance: $scope.targetImportance,
        task: $scope.targetTask
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.List();
        }
      }, function(err) {
          $window.location = '/';
      });
    };

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run({}, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $scope.docs = [];
        } else {
          $scope.docs = res.docs;
          $scope.validator.message = '';
          $scope.ResetTarget();
        }
      }, function(err) {
          $window.location = '/';
      });
    };

    $scope.Update = function(target) {
      CRUDService.Update($scope.baseUrl, target).run({}, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.List();
        }
      }, function(err) {
          $window.location = '/';
      });
    };

    $scope.Delete = function(target) {
      CRUDService.Delete($scope.baseUrl, target).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
        } else {
          $scope.validator.message = '';
          $scope.List();
        }
      }, function(err) {
          $window.location = '/';
      });
    };

    $scope.ResetTarget = function() {
      $scope.targetImportance = '보통';
      $scope.targetTask = null;
    };

    $scope.Reset = function() {
      $scope.List();
      $scope.ResetTarget();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

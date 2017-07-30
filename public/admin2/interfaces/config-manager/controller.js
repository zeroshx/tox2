/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('ManagerCtrl', [
  '$rootScope', '$scope', '$filter',
  'ManagerService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope, $filter,
    ManagerService, PApi, settings, init
  ) {

    $scope.$on('$viewContentLoaded', function() {
      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = false;
      $rootScope.settings.layout.pageBodySolid = true;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //***********************************************************************************************************
    //// Common Member Vars.

    $scope._path = init.path;

    $scope._viewTitle = {
      text: '운영 관리',
      color: 'dark'
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.RenderList = function(doc) {
      $scope._doc = doc;
      $scope._signupConfig = angular.copy(doc.signup);
      $scope._messengerConfig = angular.copy(doc.messenger);
    };

    //***********************************************************************************************************
    //// Local Vars.
    $scope._messengerRoomName = '';


    //***********************************************************************************************************
    //// Local Functions.

    $scope.ToggleSignupConfig = function () {
      $scope._signupConfigModify = !$scope._signupConfigModify;
      $scope._signupConfig = angular.copy($scope._doc.signup);
    };

    $scope.SaveSignupConfig = function() {
      PApi.StartLoading();
      ManagerService.SaveSignupConfig({
        item: $scope._signupConfig
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return ManagerService.One(function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data);
          defer.resolve();
        });
      }).then(function() {
        $scope.ToggleSignupConfig();
        PApi.Alert('저장되었습니다.');
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.AddMessengerRoom = function() {
      PApi.StartLoading();
      ManagerService.AddMessengerRoom({
        item: {
          name: $scope._messengerRoomName
        }
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return ManagerService.One(function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('추가되었습니다.');
        $scope._messengerRoomName = '';
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.RemoveMessengerRoom = function(id) {
      PApi.StartLoading();
      ManagerService.RemoveMessengerRoom({
        id: id
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return ManagerService.One(function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('삭제되었습니다.');
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.doc);
  }
]);

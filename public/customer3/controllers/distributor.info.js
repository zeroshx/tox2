angular.module('Distributor')
  .controller('DistributorInfoCtrl', function($rootScope, $scope, $routeParams, $window, $location, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/distributor/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20)
    };

    $scope.docs = [];

    /****************************************************************************
        Pagination setting
    ****************************************************************************/
    $scope.pages = [];

    $scope.MovePage = function(page) {
      $scope.query.page = Number(page);
      $scope.List();
    };

    $scope.NextPage = function() {
      var page = Number($scope.query.page);
      var totalPage = Number($scope.totalPage);
      if (page < totalPage) {
        $scope.query.page = page + 1;
        $scope.List();
      }
    };

    $scope.PreviousPage = function() {
      var page = Number($scope.query.page);
      if ((page - 1) > 0) {
        $scope.query.page = page - 1;
        $scope.List();
      }
    };

    $scope.LastPage = function() {
      $scope.query.page = Number($scope.totalPage);
      $scope.List();
    };

    $scope.FirstPage = function() {
      $scope.query.page = 1;
      $scope.List();
    };

    /****************************************************************************
        Http CRUD setting
    ****************************************************************************/

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run($scope.query, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.docs = res.member.docs;
        $scope.totalPage = res.member.totalPage;
        $scope.targetMemberTotal = res.member.total;
        $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
        $scope.targetDistributor = res.distributor;
        $scope.targetManagerNick = res.managerNick;
        $scope.FindLevelInfo(res.levelInfo);
        $scope.CalculatePercent();
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.AwaiterAccept = function(nick, id) {
      var con = confirm('[' + nick + ']을(를) 승인 하시겠습니까?');
      if(!con) return;
      CRUDService.Update($scope.baseUrl + '/accept').run({
        id: id,
        pid: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.List();
        alert('승인되었습니다.');
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.AwaiterReject = function(nick, id) {
      var con = confirm('[' + nick + ']을(를) 취소 하시겠습니까?');
      if(!con) return;
      CRUDService.Update($scope.baseUrl + '/reject').run({
        id: id,
        pid: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.List();
        alert('취소되었습니다.');
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.AwaiterRejectAll = function() {
      CRUDService.Update($scope.baseUrl + '/reject/all').run({
        pid: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.List();
        alert('전부 취소되었습니다.');
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.DropOut = function() {
      CRUDService.Update($scope.baseUrl + '/dropout').run({
        id: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert('탈퇴되었습니다.');
        $location.url('/distributor/beginning');
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.HandOver = function(id) {
      CRUDService.Update($scope.baseUrl + '/handover').run({
        id: id,
        pid: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert('총판장이 인계되었습니다.');
        $window.location.reload();
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Expell = function(id) {
      CRUDService.Update($scope.baseUrl + '/expell').run({
        id: id,
        pid: $scope.targetDistributor._id
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert('추방되었습니다.');
        $scope.List();
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl + '/modify').run({
        pid: $scope.targetDistributor._id,
        joinStyle: $scope.targetDistributor.joinStyle,
        memo: $scope.targetDistributor.memo
      }, function(res) {
        if (res.failure) return alert(res.failure);
        alert('수정되었습니다.');
        $$scope.ModifyInit();
        $scope.List();
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/

    $scope.FindLevelInfo = function(levels) {
      for (var i = 0; i < levels.length; i++) {
        if (levels[i].name == $scope.targetDistributor.level) {
          $scope.targetCurLevelInfo = levels[i];
        } else if (levels[i].name == $scope.targetDistributor.level + 1) {
          $scope.targetNextLevelInfo = levels[i];
        }
      }
    };

    $scope.CalculatePercent = function() {
      $scope.targetPercent = ($scope.targetDistributor.contribution / $scope.targetNextLevelInfo.requirement) * 100;
    };

    $scope.viewMode = null;
    $scope.Modify = function() {
      $scope.viewMode = 'UPDATE';
      $scope.targetJoinStyle = $scope.targetDistributor.joinStyle;
      $scope.targetMemo = $scope.targetDistributor.memo;
    };

    $scope.ModifyCancel = function() {
      $scope.viewMode = null;
      $scope.targetDistributor.joinStyle = $scope.targetJoinStyle;
      $scope.targetDistributor.memo = $scope.targetMemo;
    };

    $scope.ModifyInit = function() {
      $scope.viewMode = null;
      $scope.targetJoinStyle = null;
      $scope.targetMemo = null;
    };

    $scope.ResetTarget = function() {
      $scope.targetDistributor = null;
      $scope.targetCurLevelInfo = null;
      $scope.targetNextLevelInfo = null;
      $scope.targetManagerNick = null;
      $scope.targetPercent = null;
      $scope.targetMemberTotal = null;
      $scope.targetJoinStyle = null;
      $scope.targetMemo = null;
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
    };

    $scope.Reset = function() {
      $scope.ResetTarget();
      $scope.List();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

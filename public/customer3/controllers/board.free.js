angular.module('Community')
  .controller('BoardFreeCtrl', function($rootScope, $scope, $routeParams, $filter, $window, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/client/board/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 30)
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
    $scope.CreateWriting = function() {
      CRUDService.Create($scope.baseUrl).run({
        title: $scope.targetTitle,
        content: $scope.targetContent
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.FormClose();
        $scope.List();
        alert("등록하였습니다.");
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.CreateReply = function(pid) {
      CRUDService.Create($scope.baseUrl + '/reply').run({
        pid: pid,
        content: $scope.targetReply
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.ResetTarget();
        $scope.GetWriting(pid);
        alert("등록하였습니다.");
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run($scope.query, function(res) {
        if (!res.failure) {
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.RenderList();
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.GetWriting = function(id) {
      CRUDService.Read($scope.baseUrl + '/' + id).run({}, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.targetWriting = res;
        $scope.RenderContent();
        $scope.formSwitch = true;
        $scope.formMode = 'READ';
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Delete = function(id) {
      CRUDService.Delete($scope.baseUrl, id).run(function(res) {
        if (res.failure) return alert(res.failure);
        $scope.FormClose();
        $scope.List();
        alert('삭제되었습니다.');
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Opinion = function(id, pid, opinion, sort) {
      CRUDService.Update($scope.baseUrl + '/opinion', id).run({
        pid: pid,
        opinion: opinion,
        sort: sort
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.GetWriting(pid);
        alert("평가를 완료하였습니다.");
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/

    $scope._refreshTimer = 0;
    $scope.Refresh = function() {
      PublicService.RefreshContorller.Run(60,
        function(remainTime) {
          $scope._refreshTimer = remainTime;
          $scope.$apply();
        },
        function() {
          $scope.List();
        });
    };

    $scope.formSwitch = false;
    $scope.formMode = null;
    $scope.FormClose = function() {
      $scope.formSwitch = false;
      $scope.formMode = null;
      $scope.ResetTarget();
    };

    $scope.WriteFormOpen = function() {
      $scope.formSwitch = true;
      $scope.formMode = 'WRITE';
      $scope.ResetTarget();
    };

    $scope.RenderList = function() {
      for (m = 0; m < $scope.docs.length; m++) {
        $scope.docs[m].titleShort = $scope.CreateShortcut($scope.docs[m].title, 40);
      }
    };

    $scope.RenderContent = function () {

    };

    $scope.CreateShortcut = function(str, length) {
      if (!str || !angular.isString(str)) {
        return null;
      }
      if (str.length > length) {
        return str.slice(0, length) + '...';
      } else {
        return str;
      }
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 10;
    };

    $scope.ResetTarget = function() {
      $scope.targetWriting = null;
      $scope.targetTitle = null;
      $scope.targetContent = null;
      $scope.targetReply = null;
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

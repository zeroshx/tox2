angular.module('My')
  .controller('MessageCtrl', function($rootScope, $scope, $routeParams, $window, $anchorScroll, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/client/message/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      check: $routeParams.check ? $routeParams.check : '전체',
      type: $routeParams.type ? $routeParams.type : '수신'
    };

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $scope.docs = [];

    $scope._refreshTimer = 0;

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
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $scope.docs = [];
          $anchorScroll(0);
        } else {
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.RenderList();
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
          $scope.validator.message = '';
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.GetMessage = function(id) {
      $scope.ResetTarget();
      CRUDService.Read($scope.baseUrl + '/' + id).run({}, function(res) {
        $scope.targetSenderNick = res.sender.nick;
        $scope.targetReceiverNick = res.receiver.nick;
        $scope.targetTitle = res.title;
        $scope.targetContent = res.content;
        $scope.targetDate = res.createdAt;
        $scope.SetModalMode('READ');
        $scope.List();
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.SendMessage = function() {
      CRUDService.Create($scope.baseUrl).run({
        nick: $scope.targetReceiverNick,
        title: $scope.targetTitle,
        content: $scope.targetContent
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $('#messageModal').modal('hide');
        $scope.List();
        alert("발송되었습니다.");
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/
    $scope.RenderList = function() {
      for (m = 0; m < $scope.docs.length; m++) {
        $scope.docs[m].titleShort = $scope.CreateShortcut($scope.docs[m].title, 30);
      }
    };

    $scope.CreateShortcut = function(str, length) {
      if (!str || !angular.isString(str)) return;
      if (str.length > length) {
        return str.slice(0, length) + '...';
      } else {
        return str;
      }
    };

    $scope.modalMode = null;
    $scope.SetModalMode = function (mode) {
      $scope.modalMode = mode;
    };

    $scope.WriteReady = function() {
      $scope.ResetTarget();
      $scope.SetModalMode('WRITE');
      $scope.targetSenderNick = $rootScope.me.nick;
    };

    $scope.AnswerMessage = function(id) {
      $scope.WriteReady();
      for (m = 0; m < $scope.docs.length; m++) {
        if($scope.docs[m]._id === id) {
          $scope.targetReceiverNick = $scope.docs[m].sender.nick;
        }
      }
    };

    $scope.ChangeType = function(mode) {
      if ($scope.query.type !== mode) {
        $scope.query.type = mode;
        $scope.List();
      }
    };

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

    $scope.ResetQuery = function() {
      $scope.query.type = '수신';
      $scope.query.check = '전체';
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
    };

    $scope.ResetTarget = function() {
      $scope.targetSenderNick = null;
      $scope.targetReceiverNick = null;
      $scope.targetTitle = null;
      $scope.targetContent = null;
      $scope.targetDate = null;
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

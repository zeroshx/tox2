angular.module('My')
  .controller('QuestionCtrl', function($rootScope, $scope, $routeParams, $window, $anchorScroll, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/client/question/customer';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      state: $routeParams.state ? $routeParams.state : '전체'
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
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.GetQuestion = function(id) {
      $scope.ResetTarget();
      CRUDService.Read($scope.baseUrl + '/' + id).run({}, function(res) {
        $scope.targetTitle = res.question.title;
        $scope.targetContent = res.question.content;
        $scope.targetAnswer = res.answer;
        $scope.targetQuestionDate = res.createdAt;
        $scope.targetAnswerDate = res.operatedAt;
        $scope.SetModalMode('READ');
        $scope.List();
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.SendQuestion = function() {
      CRUDService.Create($scope.baseUrl).run({
        title: $scope.targetTitle,
        content: $scope.targetContent
      }, function(res) {
        if (res.failure) return alert(res.failure);
        $scope.List();
        $('#questionModal').modal('hide');
        alert("등록되었습니다.");
      }, function(err) {
        $window.location = '/';
      });
    };

    /****************************************************************************
        Etc Functions
    ****************************************************************************/
    $scope.RenderList = function() {
      for (m = 0; m < $scope.docs.length; m++) {
        $scope.docs[m].titleShort = $scope.CreateShortcut($scope.docs[m].question.title, 30);
      }
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

    $scope.modalMode = null;
    $scope.SetModalMode = function (mode) {
      $scope.modalMode = mode;
    };

    $scope.WriteReady = function() {
      $scope.ResetTarget();
      $scope.SetModalMode('WRITE');
      $scope.targetSenderNick = $rootScope.me.nick;
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
      $scope.query.state = '전체';
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
    };

    $scope.ResetTarget = function() {
      $scope.targetTitle = null;
      $scope.targetContent = null;
      $scope.targetAnswer = null;
      $scope.targetQuestionDate = null;
      $scope.targetAnswerDate = null;
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

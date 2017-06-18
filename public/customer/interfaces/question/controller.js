/* Setup blank page controller */
angular.module('TOX2APP').controller('QuestionCtrl', [
  '$rootScope', '$scope',
  'QuestionService', 'PublicFactory', 'settings', 'init',
  function(
    $rootScope, $scope,
    QuestionService, PublicFactory, settings, init
  ) {

    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //***********************************************************************************************************
    //// Common Member Vars.
    $scope._path = init.path;
    $scope._query = init.query;
    $scope._breadcrumb = [{
      path: '',
      name: '계정',
      icon: 'icon-home'
    }, {
      path: 'question',
      name: '고객센터',
      icon: 'icon-home'
    }];

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    $scope._cbLeader = false;

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

    $scope._MovePage = function(page) {
      $scope._query.page = Number(page);
      $scope.List();
    };

    $scope._NextPage = function() {
      var page = Number($scope._query.page);
      var totalPage = Number($scope._pageCount);
      if (page < totalPage) {
        $scope._query.page = page + 1;
        $scope.List();
      }
    };

    $scope._PreviousPage = function() {
      var page = Number($scope._query.page);
      if ((page - 1) > 0) {
        $scope._query.page = page - 1;
        $scope.List();
      }
    };

    $scope._LastPage = function() {
      $scope._query.page = Number($scope._pageCount);
      $scope.List();
    };

    $scope._FirstPage = function() {
      $scope._query.page = 1;
      $scope.List();
    };


    //***********************************************************************************************************
    //// Local Vars.

    //***********************************************************************************************************
    //// Local Functions.

    $scope.SendQuestion = function() {
      $scope._StartLoading();
      QuestionService.SendQuestion({
        title: $scope.targetTitle,
        content: $scope.targetContent
      }, function(data, defer) {
        if (data.failure) return defer.reject(data.failure);
        defer.resolve();
      })
      .then(function () {
        return QuestionService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.count, data.docs);
          defer.resolve();
        });
      })
      .then(function () {
        $('#WriteQuestionModal').modal('hide');
        $scope._EndLoading();
        bootbox.alert('등록되었습니다.');
      })
      .catch(function (msg) {
        $scope._EndLoading();
        bootbox.alert(msg);
      });
    };

    $scope.GetQuestion = function(doc) {
      $scope.ResetReadTarget();
      $scope._StartLoading();
      QuestionService.GetQuestion(doc._id, function (data, defer) {
        if (data.failure) return defer.reject(data.failure);
        $scope.targetQuestion = data;
        defer.resolve();
      })
      .then(function () {
        $scope._EndLoading();
      })
      .catch(function (msg) {
        $scope._EndLoading();
        bootbox.alert(msg);
      });
    };

    $scope.List = function() {
      $scope._StartLoading();
      QuestionService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.count, data.docs);
      });
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
      for(var i = 0; i < list.length; i++) {
        list[i].question.title = PublicFactory.TruncateString(list[i].question.title, 30);
      }
      $scope._list = list;
    };

    $scope.CheckAll = function() {
      for(var i = 0; i < $scope._list.length; i++) {
        $scope._list[i].checked = $scope._cbLeader;
      }
    };

    $scope.WriteQuestion = function() {
      $scope.ResetWriteTarget();
    };

    $scope.SelectQuestionState = function(state) {
      $scope._query.state = state;
      $scope.List();
    };

    $scope.ResetWriteTarget = function () {
      $scope.targetTitle = null;
      $scope.targetContent = null;
    };

    $scope.ResetReadTarget = function () {
      $scope.targetQuestion = null;
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.count, init.data.docs);
  }
]);

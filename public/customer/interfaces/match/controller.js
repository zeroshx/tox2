/* Setup blank page controller */
angular.module('TOX2APP').controller('MatchCtrl', [
  '$rootScope', '$scope', '$sce', '$state',
  'MatchService', 'PublicFactory', 'settings', 'init',
  function(
    $rootScope, $scope, $sce, $state,
    MatchService, PublicFactory, settings, init
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
      name: '매치',
      icon: 'icon-home'
    }, init.breadcrumb];

    $scope._pageTitle = init.query.kindGroup;

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope._StartLoading = function() {
      App.blockUI({
        target: '.page-content',
        overlayColor: 'none',
        animate: true
      });
    };

    $scope._EndLoading = function() {
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
    $scope.actionMode = null;
    $scope.replyTotal = null;
    $scope.d2Reply = null;
    $scope.targetWriting = null;
    $scope.targetReply = null;
    $scope.targetD2Reply = null;

    $scope.ResetWriteTarget = function() {
      $scope.targetTitle = null;
      $scope.targetContent = null;
      $scope.targetTitleHead = null;
      $scope.targetSort = null;
      $scope.SummernoteInit();
    };

    //***********************************************************************************************************
    //// Local Functions.

    $scope.List = function() {
      $scope._StartLoading();
      MatchService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.count, data.docs);
      });
    };

    $scope.GetWriting = function(id) {
      $scope._StartLoading();
      MatchService.GetWriting(id, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderWriting(data);
        App.scrollTop();
      });
    };

    $scope.CreateWriting = function() {

      if (!$scope.targetSort) {
        bootbox.alert('게시판 구분은 필수 선택입니다.');
        return;
      }

      if ($scope.targetTitleHead) {
        $scope.targetTitle = $scope.targetTitleHead + $scope.targetTitle;
      }

      $scope._StartLoading();
      $scope.targetContent = $('#summernote').summernote('code');

      MatchService.CreateWriting({
          title: $scope.targetTitle,
          content: $scope.targetContent,
          sort: $scope.targetSort
        }, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderWriting(data);
          defer.resolve();
        })
        .then(function() {
          MatchService.List($scope._query, function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.count, data.docs);
            defer.resolve();
          });
        })
        .then(function() {
          $scope._EndLoading();
          bootbox.alert('등록하였습니다.');
          App.scrollTop();
        })
        .catch(function(msg) {
          $scope._EndLoading();
          bootbox.alert(msg);
        });
    };

    $scope.CreateReply = function(pid, content) {
      $scope._StartLoading();
      MatchService.CreateReply({
        writingId: $scope.targetWriting._id,
        pid: pid,
        content: content
      }, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.targetReply = null;
        $scope.targetD2Reply = null;
        $scope.RenderWriting(data);
      });
    };

    $scope.Opinion = function(opinion) {
      $scope._StartLoading();
      MatchService.Opinion({
        id: $scope.targetWriting._id,
        opinion: opinion
      }, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderWriting(data);
        App.scrollTop();
      });
    };

    $scope.ShowD2Reply = function(id) {
      if ($scope.d2Reply === id) return $scope.d2Reply = null;
      $scope.d2Reply = id;
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._list = list;
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
    };

    $scope.RenderWriting = function(writing) {
      $scope.targetWriting = writing;
      var total = writing.reply.length;
      for (var i = 0; i < writing.reply.length; i++) {
        total = total + writing.reply[i].reply.length;
      }
      $scope.replyTotal = total;
      $scope.actionMode = 'READ';
    };

    $scope.trustedHtml = function(plainText) {
      return $sce.trustAsHtml(plainText);
    };

    $scope.OpenWriteForm = function() {
      $scope.ResetWriteTarget();
      $scope.actionMode = 'WRITE';
      $scope.targetSort = init.query.sort;
      App.scrollTop();
    };

    $scope.CloseAllAction = function() {
      $scope.actionMode = null;
    };

    $scope.ResetPage = function() {
      $scope.ResetQuery();
      $scope.List();
    };

    $scope.ResetQuery = function() {
      $scope._query.page = 1;
      $scope._query.pageSize = 40;
      $scope._query.searchFilter = null;
      $scope._query.searchKeyword = null;
    };

    $scope.SummernoteInit = function() {
      $('#summernote').summernote({
        lang: 'ko-KR',
        height: 400,
        minHeight: 400,
        focus: true,
        disableDragAndDrop: true,
        maximumImageFileSize: 204800,
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
          ['textsize', ['fontsize']],
          ['fontclr', ['color']],
          ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
          ['height', ['height']],
          ['table', ['table']],
          ['view', ['fullscreen']],
          ['insert', ['link', 'picture', 'video', 'hr']],
          //['edit', ['undo', 'redo']],
          //['headline', ['style']],
          //['fontface', ['fontname']],
          //['help', ['help']]
        ],
        callbacks: {
          onImageUploadError: function (err) {
            bootbox.alert(err);
          }
        }
      });
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.count, init.data.docs);
    $scope.ResetWriteTarget();
  }
]);

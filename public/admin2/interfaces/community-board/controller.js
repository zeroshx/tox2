/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('BoardCtrl', [
  '$rootScope', '$scope', '$sce',
  'BoardService', 'PApi', 'settings', 'init', 'sites',
  function(
    $rootScope, $scope, $sce,
    BoardService, PApi, settings, init, sites
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
    $scope._query = init.query;
    $scope._selectLeader = false;

    $scope._item = {};

    $scope._viewTitle = {
      text: '게시판 관리',
      color: 'green-meadow'
    };

    $scope._searchFilter = ['닉네임', '아이디', '제목', '내용'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {};

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailViewSetup = function (doc) {
      $scope._item = doc;
      $scope._detailViewFormat = [
        [{
          label: 'No.',
          type: 'text',
          value: $scope._item._id,
          width: [2, 4]
        }, {
          label: '사이트',
          type: 'text',
          value: $scope._item.site,
          width: [2, 4]
        }],
        [{
          label: '게시판',
          type: 'text',
          value: $scope._item.sort,
          width: [2, 4]
        }, {
          label: '구분',
          type: 'text',
          value: $scope._item.form,
          width: [2, 4]
        }],
        [{
          label: '작성자',
          type: 'text',
          value: $scope._item.writerType + ' - ' + $scope._item.nick + '(' + $scope._item.uid + ')',
          width: [2, 4]
        }, {
          label: '레벨',
          type: 'text',
          value: $scope._item.level,
          width: [2, 4]
        }],
        [{
          label: '제목',
          type: 'text',
          value: $scope._item.title,
          width: [2, 10]
        }],
        [{
          label: '내용',
          type: 'board-content',
          value: $sce.trustAsHtml($scope._item.content),
          width: [2, 10]
        }],
        [{
          label: '조회수',
          type: 'text',
          value: $scope._item.hit.count,
          width: [2, 4]
        }, {
          label: '평가',
          type: 'text',
          value: $scope._item.opinion.good + ' / ' + $scope._item.opinion.bad,
          width: [2, 4]
        }], [{
          label: '댓글',
          type: 'board-reply',
          value: $scope._item,
          api: {
            GetReply: $scope.GetReply,
            ShowToggle: $scope.ShowToggle,
            RemoveReply: $scope.RemoveReply
          },
          width: [2, 10]
        }]
      ];
    };

    $scope.DetailView = function(doc) {
      $scope._dvfReplyCreate = false;
      $scope.ResetReplyModel();
      PApi.StartLoading();
      BoardService.One({
        id: doc._id
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        $scope.DetailViewSetup(data);
        defer.resolve();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        show: true,
        top: true,
        nick: '',
        site: '',
        level: '',
        sort: '',
        title: '',
        content: '',
        writerType: '운영자'
      };
    };

    $scope.ResetReplyModel = function() {
      $scope._reply = {
        nick: '',
        level: '',
        content: ''
      };
    };

    $scope.SelectAll = function() {
      for (i in $scope._list) {
        if ($scope._list[i]._cbExist) $scope._list[i]._cbSelected = $scope._selectLeader;
      }
    };

    $scope.GetSelectedList = function() {
      var list = [];
      for (i in $scope._list) {
        if ($scope._list[i]._cbSelected)
          list.push($scope._list[i]._id);
      }
      return list;
    };

    $scope.CreateForm = function() {
      $scope.ResetFormModel();
      $scope._formSwitch = true;
      $scope._formAction = 'CREATE';
      PApi.ScrollTop();
    };

    $scope.ModifyForm = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._formSwitch = true;
      $scope._formAction = 'MODIFY';
      PApi.ScrollTop();
    };

    $scope.CloseForm = function() {
      $scope._formSwitch = false;
      $scope._formAction = null;
    };

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._lastPage = lastPage;
    };

    //***********************************************************************************************************
    //// Local Vars.
    $scope._sites = sites;

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Add = function() {
      PApi.StartLoading();
      BoardService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return BoardService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('등록이 완료되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Modify = function() {
      PApi.StartLoading();
      BoardService.Modify({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return BoardService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('수정되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.CancelCreateReply = function() {
      $scope.ResetReplyModel();
      $scope._dvfReplyCreate = false;
    };

    $scope.ShowToggle = function(id, listType) {
      PApi.StartLoading();
      BoardService.ShowToggle({
        id: id
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        if (listType === 'WRITING') {
          return BoardService.List($scope._query, function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
        } else if (listType === 'REPLY') {
          return BoardService.ReplyList({
            id: $scope._item._id
          }, function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope._item.reply = data.docs;
            defer.resolve();
          });
        }
      }).then(function() {
        PApi.Alert('변경되었습니다.');
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.BulkShowToggle = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.StartLoading();
      var queue = BoardService.ShowToggle({
        id: list[0]
      });
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return BoardService.ShowToggle({
              id: list[ii]
            });
          });
        })(i);
      }
      queue.then(function(legacy) {
        return BoardService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function() {
        $scope._selectLeader = false;
        PApi.EndLoading();
        PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
      });
    };

    $scope.Remove = function(id) {
      if (!PApi.IsValidString(id)) return;
      PApi.StartLoading();
      BoardService.Remove(
        id,
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return BoardService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('삭제되었습니다.');
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.BulkRemove = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.StartLoading();
      var queue = BoardService.Remove(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return BoardService.Remove(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return BoardService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).finally(function() {
        $scope._selectLeader = false;
        PApi.EndLoading();
        PApi.Alert('처리되었습니다. 결과는 리스트를 확인 바랍니다.');
      });
    };

    $scope.GetReply = function() {
      PApi.StartLoading();
      BoardService.ReplyList({
        id: $scope._item._id
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        $scope._item.reply = data.docs;
        defer.resolve();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.CreateReply = function() {
      PApi.StartLoading();
      BoardService.CreateReply({
        pid: $scope._item._id,
        reply: $scope._reply
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return BoardService.ReplyList({
          id: $scope._item._id
        }, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope._item.reply = data.docs;
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('댓글이 추가되었습니다.');
        $scope.ResetReplyModel();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.RemoveReply = function(id) {
      if (!PApi.IsValidString(id)) return;
      PApi.StartLoading();
      BoardService.RemoveReply({
          id: id,
          pid: $scope._item._id
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return BoardService.ReplyList({
            id: $scope._item._id
          },
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope._item.reply = data.docs;
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('삭제되었습니다.');
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      BoardService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    $scope.SetWriterType = function(type) {
      $scope._item.writerType = type;
      $scope._item.top = false;

    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

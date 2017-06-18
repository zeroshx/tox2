/* Setup blank page controller */
angular.module('TOX2APP').controller('MessageCtrl', [
  '$rootScope', '$scope',
  'MessageService', 'UserService', 'PublicFactory', 'settings', 'init', 'count',
  function(
    $rootScope, $scope,
    MessageService, UserService, PublicFactory, settings, init, count
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
      path: 'message',
      name: '쪽지함',
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
    $scope.messageBoxTitle = '받은 쪽지함';

    //***********************************************************************************************************
    //// Local Functions.

    $scope.SendMessage = function() {
      $scope._StartLoading();
      MessageService.SendMessage({
        nick: $scope.targetReceiverNick,
        title: $scope.targetTitle,
        content: $scope.targetContent
      }, function(data, defer) {
        if (data.failure) return defer.reject(data.failure);
        $scope.SelectMessageType('발신');
        $scope.SelectMessageCheck('전체');
        defer.resolve();
      })
      .then(function () {
        return MessageService.NewCount(function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.newCount = data;
          defer.resolve();
        });
      })
      .then(function () {
        return MessageService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.count, data.docs);
          defer.resolve();
        });
      })
      .then(function () {
        $('#WriteMessageModal').modal('hide');
        $scope._EndLoading();
        bootbox.alert('전송되었습니다.');
      })
      .catch(function (msg) {
        $scope._EndLoading();
        bootbox.alert(msg);
      });
    };

    $scope.ReadMessage = function(doc) {
      $scope.ResetReadTarget();
      $scope._StartLoading();
      MessageService.ReadMessage(doc._id, function (data,defer) {
        if (data.failure) return defer.reject(data.failure);
        $scope.targetMessage = data;
        defer.resolve();
      })
      .then(function () {
        return MessageService.NewCount(function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.newCount = data;
          defer.resolve();
        });
      })
      .then(function () {
        return MessageService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.count, data.docs);
          defer.resolve();
        });
      })
      .then(function () {
        return UserService.GetNewMessages(function (data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        });
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
      MessageService.List($scope._query, function(data) {
        $scope._EndLoading();
        if (data.failure) return bootbox.alert(data.failure);
        $scope.RenderList(data.count, data.docs);
      });
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
      for(var i = 0; i < list.length; i++) {
        list[i].title = PublicFactory.TruncateString(list[i].title, 15);
      }
      $scope._list = list;
    };

    $scope.WriteMessage = function() {
      $scope.ResetWriteTarget();
      $scope.targetSenderNick = $rootScope.__GetUser('me').nick;
    };

    $scope.ReplyMessage = function() {
      $scope.ResetWriteTarget();
      $scope.targetSenderNick = $rootScope.__GetUser('me').nick;
      $scope.targetReceiverNick = $scope.targetMessage.sender.nick;
    };

    $scope.SelectMessageType = function(type, reload) {
      if($scope._query.type === type && !reload) return;
      $scope._query.type = type;
      if(type === '수신') {
        $scope.messageBoxTitle = '받은 쪽지함';
      } else {
        $scope.messageBoxTitle = '보낸 쪽지함';
      }
      if(reload) {
        $scope.List();
      }
    };

    $scope.SelectMessageCheck = function(check, reload) {
      if($scope._query.check === check && !reload) return;
      $scope._query.check = check;
      if(reload) {
        $scope.List();
      }
    };

    $scope.CheckAll = function() {
      for(var i = 0; i < $scope._list.length; i++) {
        $scope._list[i].checked = $scope._cbLeader;
      }
    };

    $scope.ResetWriteTarget = function () {
      $scope.targetSenderNick = null;
      $scope.targetReceiverNick = null;
      $scope.targetTitle = null;
      $scope.targetContent = null;
    };

    $scope.ResetReadTarget = function () {
      $scope.targetMessage = null;
    };
    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.data.count, init.data.docs);
    $scope.newCount = count.data;
  }
]);

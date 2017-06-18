/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('MessageCtrl', [
  '$rootScope', '$scope',
  'MessageService', 'PApi', 'settings', 'init', 'sites', 'distributors',
  function(
    $rootScope, $scope,
    MessageService, PApi, settings, init, sites, distributors
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
      text: '메시지 관리',
      color: 'yellow-crusta'
    };

    $scope._searchFilter = ['보낸이', '받는이', '제목', '내용'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '쪽지보내기'
      },
      element: [{
        label: '제목',
        type: 'text',
        bind: '.title'
      }, {
        label: '내용',
        type: 'multi-text',
        bind: '.content',
        rows: 5
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = doc;
      $scope._detailViewFormat = [
        [{
          label: '보낸이',
          type: 'text',
          value: doc.sender.nick + '('+ doc.sender.uid +')',
          width: [2, 4]
        }],
        [{
          label: '제목',
          type: 'text',
          value: doc.title,
          width: [2, 10]
        }],
        [{
          label: '내용',
          type: 'multi-text',
          value: doc.content,
          rows: 7,
          width: [2, 10]
        }],
        [{
          label: '보낸 일시',
          type: 'text',
          value: doc.createdAt,
          width: [2, 4]
        }, {
          label: '받은 일시',
          type: 'text',
          value: doc.confirmedAt,
          width: [2, 4]
        }],
      ];

      if(doc.category === '전체') {
        $scope._detailViewFormat[0].push({
          label: '받은이',
          type: 'text',
          value: '모든 회원',
          width: [2, 4]
        });
      } else if(doc.category === '사이트') {
        $scope._detailViewFormat[0].push({
          label: '받은이',
          type: 'text',
          value: doc.receiver.site + '(사이트)',
          width: [2, 4]
        });
      } else if(doc.category === '총판') {
        $scope._detailViewFormat[0].push({
          label: '받은이',
          type: 'text',
          value: doc.receiver.distributor + '(총판)',
          width: [2, 4]
        });
      } else if(doc.category === '회원') {
        $scope._detailViewFormat[0].push({
          label: '받은이',
          type: 'text',
          value: doc.receiver.nick + '('+ doc.receiver.uid +')',
          width: [2, 4]
        });
      }
    };

    $scope.ResetFormModel = function() {
      $scope._item = {
        title: '운영진 안내 쪽지입니다.',
        content: ''
      };
    };

    $scope.SelectAll = function() {
      for (i in $scope._list) {
        if($scope._list[i]._cbExist) $scope._list[i]._cbSelected = $scope._selectLeader;
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
      $scope._item = doc;
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

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Send = function() {
      PApi.StartLoading();
      MessageService.Send({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return MessageService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('전송이 완료되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Remove = function(id) {
      if(!PApi.IsValidString(id)) return;
      PApi.StartLoading();
      MessageService.Remove(
        id,
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return MessageService.List(
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
      var queue = MessageService.Remove(list[0]);
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return MessageService.Remove(list[ii]);
          });
        })(i);
      }
      queue.then(function(legacy) {
        return MessageService.List($scope._query, function(data, defer) {
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

    $scope.List = function() {
      PApi.StartLoading();
      MessageService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    $scope.SendAll = function () {
      $scope._formFormatCopy = null;
      $scope._formFormatCopy = angular.copy($scope._formFormat);
      $scope.CreateForm();
      $scope._item.category = '전체';
    };

    $scope.SendSite = function () {
      $scope._formFormatCopy = null;
      $scope._formFormatCopy = angular.copy($scope._formFormat);
      $scope._formFormatCopy.element.unshift({
        label: '사이트',
        type: 'text-dropdown',
        bind: '.receiver.site',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: sites.docs
        }
      });
      $scope.CreateForm();
      $scope._item.category = '사이트';
    };

    $scope.SendDistributor = function () {
      $scope._formFormatCopy = null;
      $scope._formFormatCopy = angular.copy($scope._formFormat);
      $scope._formFormatCopy.element.unshift({
        label: '총판',
        type: 'text-dropdown',
        bind: '.receiver.distributor',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: distributors.docs
        }
      });
      $scope.CreateForm();
      $scope._item.category = '총판';
    };

    $scope.SendUser = function () {
      $scope._formFormatCopy = null;
      $scope._formFormatCopy = angular.copy($scope._formFormat);
      $scope._formFormatCopy.meta.notice = '아이디 또는 닉네임 하나만 입력하여도 쪽지는 전송됩니다. 둘다 입력되었을 경우 아이디를 우선하여 전송합니다.';
      $scope._formFormatCopy.element.unshift({
        label: '아이디',
        type: 'text',
        bind: '.receiver.uid'
      },{
        label: '닉네임',
        type: 'text',
        bind: '.receiver.nick'
      });
      $scope.CreateForm();
      $scope._item.category = '회원';
    };

    $scope.SendUserDirectly = function (uid, nick) {
      $scope.SendUser();
      $scope._item.receiver = {
        uid: uid,
        nick: nick
      };
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

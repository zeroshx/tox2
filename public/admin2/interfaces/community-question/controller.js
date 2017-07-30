/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('QuestionCtrl', [
  '$rootScope', '$scope', '$filter',
  'QuestionService', 'PApi', 'settings', 'init',
  function(
    $rootScope, $scope, $filter,
    QuestionService, PApi, settings, init
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
      text: '고객센터 Q&A',
      color: 'blue'
    };

    $scope._searchFilter = ['닉네임', '제목', '내용'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {};

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.DetailView = function(doc) {
      $scope._item = angular.copy(doc);
      $scope._detailViewFormat = [
        [{
          label: '처리상태',
          type: 'text',
          value: doc.state,
          width: [2, 4]
        }, {
          label: '분류',
          type: 'text',
          value: doc.style + '문의',
          width: [2, 4]
        }],
        [{
          label: '담당자',
          type: 'text',
          value: doc.operator,
          width: [2, 4]
        }],
        [{
          label: '문의 제목',
          type: 'text',
          value: doc.question.title,
          width: [2, 10]
        }],
        [{
          label: '문의 내용',
          type: 'multi-text',
          value: doc.question.title,
          width: [2, 10]
        }],
        [{
          label: '문의 일시',
          type: 'text',
          value: $filter('datetime')(doc.createdAt),
          width: [2, 4]
        }, {
          label: '처리 일시',
          type: 'text',
          value: $filter('datetime')(doc.operatedAt),
          width: [2, 4]
        }]
      ];

      if (doc.style === '비회원') {
        $scope._detailViewFormat[1].unshift({
          label: '문의 회원',
          type: 'text',
          value: doc.uid,
          width: [2, 4]
        });
      } else if (doc.style === '회원') {
        $scope._detailViewFormat[1].unshift({
          label: '문의 회원',
          type: 'text',
          value: doc.nick + '(' + doc.uid + ')',
          width: [2, 4]
        });
      }

      if (doc.state === '완료') {
        $scope._detailViewFormat.splice(4, 0, [{
          label: '답변 내용',
          type: 'multi-text',
          value: doc.answer,
          width: [2, 10]
        }]);
      }
    };

    $scope.ResetFormModel = function() {
      $scope._item = {};
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
      $scope._formSwitch = null;
      $scope._formAction = null;
    };

    $scope.RenderList = function(lastPage, list) {
      $scope._list = list;
      $scope._lastPage = lastPage;
    };



    //***********************************************************************************************************
    //// Local Vars.
    $scope._answer = null;

    //***********************************************************************************************************
    //// Local Functions.

    $scope.Postpone = function(id) {
      PApi.StartLoading();
      QuestionService.Postpone({
        id: id
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return QuestionService.List($scope._query, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          $scope.RenderList(data.lastPage, data.docs);
          defer.resolve();
        });
      }).then(function() {
        PApi.Alert('보류 상태로 전환되었습니다.');
        $scope.CloseForm();
      }).catch(function(msg) {
        PApi.Alert(msg);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.Answer = function(id) {
      PApi.StartLoading();
      QuestionService.Answer({
          id: id,
          answer: $scope._answer
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return QuestionService.One({
            id: id
          },
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.DetailView(data);
            defer.resolve();
          });
      }).then(function(legacy) {
        return QuestionService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('처리되었습니다.');
        $scope.CancelAnswer();
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.BulkPostpone = function() {
      var list = $scope.GetSelectedList();
      if (list.length === 0) return;
      PApi.StartLoading();
      var queue = QuestionService.Postpone({
        id: list[0]
      });
      for (var i = 1; i < list.length; i++) {
        (function(ii) {
          queue = queue.then(function() {
            return QuestionService.Postpone({
              id: list[ii]
            });
          });
        })(i);
      }
      queue.then(function(legacy) {
        return QuestionService.List($scope._query, function(data, defer) {
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

    $rootScope.__QuestionList = $scope.List = function() {
      PApi.StartLoading();
      QuestionService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    $scope.AnswerForm = function() {
      $scope._fAnswer = true;
    };

    $scope.CancelAnswer = function() {
      $scope._fAnswer = false;
      $scope._answer = null;
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

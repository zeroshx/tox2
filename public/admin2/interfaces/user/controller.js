/* Setup blank page controller */
angular.module('TOX2ADMINAPP').controller('UserCtrl', [
  '$rootScope', '$scope',
  'UserService', 'PApi', 'settings', 'init', 'sites', 'levels', 'banks',
  function(
    $rootScope, $scope,
    UserService, PApi, settings, init, sites, levels, banks
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

    $scope._viewTitle = {
      header: '회원 관리',
      text: '기본 설정',
      color: 'red'
    };

    $scope._searchFilter = ['아이디', '닉네임', '예금주'];

    $scope._formSwitch = null;
    $scope._formAction = null;

    $scope._formFormat = {
      meta: {
        title: '회원 등록'
      },
      element: [{
        label: '아이디',
        type: 'text',
        bind: '.uid',
        placeholder: '영문 소자, 숫자를 이용하여 5자 이상 16자',
        readonly: 'MODIFY'
      }, {
        label: '닉네임',
        type: 'text',
        bind: '.nick',
        placeholder: '한글, 영문, 숫자를 이용하여 2자 이상 16자'
      }, {
        label: '패스워드',
        type: 'text',
        bind: '.password',
        placeholder: '8자 이상 30자 이내'
      }, {
        label: '회원 상태',
        type: 'button-group',
        bind: '.state',
        button: [{
          value: '정지',
          class: 'red-soft'
        }, {
          value: '일반',
          class: 'green-soft'
        }, {
          value: '테스터',
          class: 'yellow-crusta'
        }]
      }, {
        label: '사이트',
        type: 'text-dropdown',
        bind: '.site',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: sites.docs
        }
      }, {
        label: '레벨',
        type: 'text-dropdown',
        bind: '.level',
        dropdown: {
          class: 'btn-default',
          property: '_id',
          list: levels.docs
        }
      }, {
        label: '예금주',
        type: 'text',
        bind: '.account.holder'
      }, {
        label: '은행',
        type: 'text-dropdown',
        bind: '.account.bank',
        dropdown: {
          class: 'btn-default',
          property: 'name',
          list: banks.docs
        }
      }, {
        label: '계좌',
        type: 'text',
        bind: '.account.number'
      }, {
        label: '계좌 인증코드',
        type: 'text',
        bind: '.account.pin',
        placeholder: '4~8자리 숫자'
      }, {
        label: '이메일',
        type: 'text',
        bind: '.email'
      }, {
        label: '연락처',
        type: 'text',
        bind: '.phone'
      }, {
        label: '추천인',
        type: 'text',
        bind: '.recommander'
      }]
    };

    //***********************************************************************************************************
    //// Common Member Functions.

    $scope.ResetFormModel = function() {
      $scope._item = {
        uid: '',
        nick: '',
        password: '',
        state: '일반',
        site: '',
        level: '',
        account: {
          bank: '',
          holder: '',
          number: '',
          pin: ''
        },
        email: '',
        phone: '',
        recommander: ''
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

    $scope.Add = function() {
      PApi.StartLoading();
      UserService.Add({
        item: $scope._item
      }, function(data, defer) {
        if (data.failure) defer.reject(data.failure);
        defer.resolve();
      }).then(function() {
        return UserService.List($scope._query, function(data, defer) {
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
      UserService.Modify({
          item: $scope._item
        },
        function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        }
      ).then(function(legacy) {
        return UserService.List(
          $scope._query,
          function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.RenderList(data.lastPage, data.docs);
            defer.resolve();
          });
      }).then(function(legacy) {
        PApi.Alert('수정되었습니다.');
        $scope.CloseForm();
      }).catch(function(legacy) {
        PApi.Alert(legacy);
      }).finally(function() {
        PApi.EndLoading();
      });
    };

    $scope.List = function() {
      PApi.StartLoading();
      UserService.List($scope._query, function(data) {
        if (data.failure) return PApi.Alert(data.failure);
        $scope.RenderList(data.lastPage, data.docs);
        PApi.EndLoading();
      });
    };

    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.RenderList(init.list.lastPage, init.list.docs);
  }
]);

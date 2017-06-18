angular.module('TOX2ADMINAPP')
  .controller('BoardCtrl', function($rootScope, $scope, $routeParams, $filter, $window, $anchorScroll, CRUDService, PublicService) {

    /****************************************************************************
        Basic Vars setting
    ****************************************************************************/
    $scope.baseUrl = '/client/board';

    $scope.query = {
      page: Number($routeParams.page ? $routeParams.page : 1),
      pageSize: Number($routeParams.pageSize ? $routeParams.pageSize : 20),
      searchKeyword: $routeParams.searchKeyword ? $routeParams.searchKeyword : '',
      searchFilter: $routeParams.searchFilter ? $routeParams.searchFilter : '',
      form: $routeParams.form ? $routeParams.form : '전체',
      site: $routeParams.site ? $routeParams.site : '전체'
    };

    $scope.validator = {
      type: 'error',
      message: ''
    };

    $scope.docs = [];

    /****************************************************************************
        Sub Menu setting
    ****************************************************************************/
    for (var i in $rootScope.mainmenu) {
      if ($rootScope.mainmenu[i].name === '고객센터') {
        $rootScope.submenu = $rootScope.mainmenu[i].submenu;
      }
    }


    /****************************************************************************
        Search setting
    ****************************************************************************/
    $scope.searchFilters = [
      '닉네임', '아이디', '제목', '내용'
    ];

    $scope.Search = function(mode) {
      if (mode === 'RESET') {
        $scope.ResetQuery();
        $scope.Reset();
      } else {
        $scope.FirstPage();
      }
    };


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
        Form On/Off setting
    ****************************************************************************/
    $scope.formSwitch = false;
    $scope.forMode = '';

    $scope.FormOpen = function(mode, id) {
      $scope.ResetTarget();
      $scope.SiteList();
      $scope.formMode = mode;
      $scope.formSwitch = true;

      if ($scope.formMode === 'UPDATE' || $scope.formMode === 'VERIFY') {
        var docCheck = false;
        for (var i in $scope.docs) {
          if ($scope.docs[i]._id === id) {
            docCheck = true;
            $scope.targetId = $scope.docs[i]._id;
            $scope.targetUid = $scope.docs[i].uid;
            $scope.targetNick = $scope.docs[i].nick;
            $scope.targetLevel = $scope.docs[i].level;
            $scope.targetSite = $scope.docs[i].site;
            $scope.targetForm = $scope.docs[i].form;
            $scope.targetSort = $scope.docs[i].sort;
            $scope.targetTitle = $scope.docs[i].title;
            $scope.targetContent = $scope.docs[i].content;
          }
        }
        if (!docCheck) {
          $scope.validator.type = 'error';
          $scope.validator.message = '존재하지 않는 리스트입니다. 새로고침 후 다시 시도 바랍니다.';
          $anchorScroll(0);
        }
      } else { // mode === 'CREATE'
        $scope.targetForm = '글';
      }
    };

    $scope.FormClose = function() {
      $scope.formSwitch = false;
      $scope.forMode = '';
      $scope.validator.message = '';
    };


    /****************************************************************************
        Input Site Select setting
    ****************************************************************************/
    $scope.siteList = [];
    $scope.SelectSite = function(name) {
      $scope.targetSite = name;
    };

    $scope.SiteList = function() {
      CRUDService.Read('/site/all').run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.siteList = res.docs;
        }
      }, function(err) {
        $window.location = '/';
      });
    };


    /****************************************************************************
        Http CRUD setting
    ****************************************************************************/
    $scope.Create = function() {
      CRUDService.Create($scope.baseUrl).run({
        uid: $scope.targetUid,
        nick: $scope.targetNick,
        level: $scope.targetLevel,
        site: $scope.targetSite,
        form: $scope.targetForm,
        sort: $scope.targetSort,
        title: $scope.targetTitle,
        content: $scope.targetContent,
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
          $scope.FormClose();
          $scope.List();
          alert("추가되었습니다.");
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.List = function() {
      CRUDService.Read($scope.baseUrl).run($scope.query, function(res) {
        if (res.failure) {
          console.log(res.failure);
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $scope.docs = [];
          $scope.query.searchKeyword = '';
          $anchorScroll(0);
        } else {
          $scope.docs = res.docs;
          $scope.totalPage = res.count;
          $scope.RenderList();
          $scope.pages = PublicService.Pagination($scope.query.page, $scope.totalPage, $scope.baseUrl, $scope.query);
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Update = function() {
      CRUDService.Update($scope.baseUrl, $scope.targetId).run({
        nick: $scope.targetNick,
        level: $scope.targetLevel,
        site: $scope.targetSite,
        form: $scope.targetForm,
        sort: $scope.targetSort,
        title: $scope.targetTitle,
        content: $scope.targetContent,
      }, function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          $scope.validator.message = '';
          $scope.selectAllSwitch = false;
          $scope.FormClose();
          $scope.List();
          alert('수정되었습니다.');
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.Delete = function(id, mode) {
      CRUDService.Delete($scope.baseUrl, id).run(function(res) {
        if (res.failure) {
          $scope.validator.type = 'error';
          $scope.validator.message = res.failure;
          $anchorScroll(0);
        } else {
          if (mode === 'ONE') {
            $scope.validator.message = '';
            $scope.selectAllSwitch = false;
            $scope.List();
            alert('삭제되었습니다.');
          } else {
            $scope.deleteSuccess++;
            if ($scope.deleteSuccess === $scope.deleteTotal) {
              $scope.validator.message = '';
              $scope.selectAllSwitch = false;
              $scope.List();
              alert("삭제되었습니다.");
            }
          }
        }
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.DeleteAll = function() {
      $scope.deleteTotal = 0;
      $scope.deleteSuccess = 0;
      for (var i in $scope.docs) {
        if ($scope.docs[i].checked) {
          $scope.deleteTotal++;
          $scope.Delete($scope.docs[i]._id, 'MANY');
        }
      }
    };

    $scope.GetReply = function(id) {

      $scope.targetReply = null;
      $scope.targetReplyParent = null;
      $scope.targetReplySite = null;
      $scope.targetReplyUid = null;
      $scope.targetReplyNick = null;
      $scope.targetReplyLevel = null;
      $scope.targetReplyContent = null;

      CRUDService.Read($scope.baseUrl + '/reply').run({
        id: id
      }, function(res) {
        $scope.targetReply = res.docs;
        $scope.targetReplyParent = id;
      }, function(err) {
        $window.location = '/';
      });
    };

    $('#replyModal').on('hidden.bs.modal', function(e) {
      $scope.List();
    });

    $scope.RemoveReply = function(id) {
      CRUDService.Delete($scope.baseUrl + '/reply', id).run({pid: $scope.targetReplyParent}, function(res) {
        $scope.GetReply($scope.targetReplyParent);
      }, function(err) {
        $window.location = '/';
      });
    };

    $scope.AddReply = function() {
      CRUDService.Create($scope.baseUrl + '/reply').run({
        uid: $scope.targetReplyUid,
        nick: $scope.targetReplyNick,
        level: $scope.targetReplyLevel,
        site: $scope.targetReplySite,
        content: $scope.targetReplyContent,
        pid: $scope.targetReplyParent
      }, function(res) {
        if(res.failure) return alert(res.failure);
        $scope.GetReply($scope.targetReplyParent);
      }, function(err) {
        $window.location = '/';
      });
    };
    /****************************************************************************
        Etc Functions
    ****************************************************************************/
    $scope.RenderList = function() {

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

    $scope.ChangePageSize = function() {
      $scope.query.pageSize = Number($scope.query.pageSize);
      if ($scope.query.pageSize > 0) {
        $scope.query.page = 1;
        $scope.List();
      } else {
        alert("1이상의 수를 입력해주세요.");
      }
    };

    $scope.SelectAll = function() {
      if ($scope.selectAllSwitch) {
        for (var i in $scope.docs) {
          $scope.docs[i].checked = true;
        }
      } else {
        for (var j in $scope.docs) {
          $scope.docs[j].checked = false;
        }
      }
    };

    $scope.ResetQuery = function() {
      $scope.query.page = 1;
      $scope.query.pageSize = 20;
      $scope.query.searchKeyword = '';
      $scope.query.searchFilter = '';
      $scope.query.form = '전체';
      $scope.query.site = '전체';
    };

    $scope.ResetTarget = function() {
      $scope.targetId = null;
      $scope.targetUid = null;
      $scope.targetNick = null;
      $scope.targetLevel = null;
      $scope.targetSite = null;
      $scope.targetForm = null;
      $scope.targetSort = null;
      $scope.targetTitle = null;
      $scope.targetContent = null;
      $scope.targetReply = null;
      $scope.targetReplyParent = null;
      $scope.targetReplySite = null;
      $scope.targetReplyUid = null;
      $scope.targetReplyNick = null;
      $scope.targetReplyLevel = null;
      $scope.targetReplyContent = null;
    };

    $scope.Reset = function() {
      $scope.formSwitch = null;
      $scope.List();
      $scope.SiteList();
      $scope.ResetTarget();
    };

    /****************************************************************************
        Controller Init
    ****************************************************************************/
    $scope.Reset();
  });

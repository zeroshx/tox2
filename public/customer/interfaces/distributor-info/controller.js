/* Setup blank page controller */
angular.module('TOX2APP').controller('DistributorInfoCtrl', [
  '$rootScope', '$scope', '$state', '$window',
  'DistributorInfoService', 'PublicFactory', 'settings', 'init', 'info',
  function(
    $rootScope, $scope, $state, $window,
    DistributorInfoService, PublicFactory, settings, init, info
  ) {

    $scope.$on('$viewContentLoaded', function() {

      // set default layout mode
      $rootScope.settings.layout.pageContentWhite = true;
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;
    });

    if(!$rootScope.__GetUser('me').distributor || !$rootScope.__GetUser('me').distributor.name) {
      return $state.go('distributor-signup');
    }

    if(init.data.failure || info.data.failure) {
      return $state.go('error');
    }

    //***********************************************************************************************************
    //// Common Member Vars.
    $scope._path = init.path;
    $scope._query = init.query;
    $scope._breadcrumb = [{
      path: '',
      name: '총판',
      icon: 'icon-home'
    }, {
      path: 'distributor-info',
      name: '내 총판',
      icon: 'icon-home'
    }];

    $scope._pages = null;
    $scope._pageCount = null;

    $scope._list = null;

    $scope._cbLeader = false;

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
    $scope.targetDistributor = info.data.distributor;
    $scope.targetLevelInfo = info.data.levelInfo;
    $scope.targetMemberTotal = init.data.total;
    $scope.viewMode = 'DISPLAY';

    //***********************************************************************************************************
    //// Local Functions.

    $scope.List = function() {
      $scope._StartLoading();
      DistributorInfoService.List($scope._query, function(data, defer) {
        if(data.failure) return defer.reject(data.failure);
        $scope.targetMemberTotal = data.total;
        $scope.RenderList(data.totalPage, data.docs);
        defer.resolve();
      })
      .then(function () {
        return DistributorInfoService.Overview({}, function (data, defer) {
          if(data.failure) return defer.reject(data.failure);
          $scope.targetDistributor = data.distributor;
          $scope.targetLevelInfo = data.levelInfo;
          $scope.FindLevelInfo();
          $scope.CalculatePercent();
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

    $scope.Update = function() {
      if ($scope.targetDistributor.memo === $scope.targetMemo &&
        $scope.targetDistributor.joinStyle === $scope.targetJoinStyle) {
        return $scope.viewMode = 'DISPLAY';
      }
      $scope._StartLoading();
      DistributorInfoService.Update({
          pid: $scope.targetDistributor._id,
          joinStyle: $scope.targetJoinStyle,
          memo: $scope.targetMemo
        }, function(data, defer) {
          if (data.failure) return defer.reject(data.failure);
          defer.resolve();
        })
        .then(function() {
          return DistributorInfoService.List($scope._query, function(data, defer) {
            if (data.failure) return defer.reject(data.failure);
            $scope.targetMemberTotal = data.total;
            $scope.RenderList(data.totalPage, data.docs);
            defer.resolve();
          });
        })
        .then(function () {
          return DistributorInfoService.Overview({}, function (data, defer) {
            if(data.failure) return defer.reject(data.failure);
            $scope.targetDistributor = data.distributor;
            $scope.targetLevelInfo = data.levelInfo;
            $scope.FindLevelInfo();
            $scope.CalculatePercent();
            defer.resolve();
          });
        })
        .then(function() {
          $scope._EndLoading();
          $scope.viewMode = 'DISPLAY';
          bootbox.alert('수정되었습니다.');
        })
        .catch(function(msg) {
          $scope._EndLoading();
          bootbox.alert(msg);
        });
    };

    $scope.DropOut = function() {
      bootbox.confirm('정말 탈퇴하시겠습니까? 총판에 대한 당신의 모든 정보는 삭제됩니다.',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.DropOut({
                id: $scope.targetDistributor._id
              }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('탈퇴되었습니다.', function() {
                  $state.go('distributor-signup');
                });
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.AwaiterAccept = function(nick, id) {
      bootbox.confirm('[' + nick + ']을(를) 승인 하시겠습니까?',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.AwaiterAccept({
                id: id,
                pid: $scope.targetDistributor._id
              }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                return DistributorInfoService.List($scope._query, function(data, defer) {
                  if (data.failure) return defer.reject(data.failure);
                  $scope.targetMemberTotal = data.total;
                  $scope.RenderList(data.totalPage, data.docs);
                  defer.resolve();
                });
              })
              .then(function () {
                return DistributorInfoService.Overview({}, function (data, defer) {
                  if(data.failure) return defer.reject(data.failure);
                  $scope.targetDistributor = data.distributor;
                  $scope.targetLevelInfo = data.levelInfo;
                  $scope.FindLevelInfo();
                  $scope.CalculatePercent();
                  defer.resolve();
                });
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('승인하였습니다.');
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.AwaiterReject = function(nick, id) {
      bootbox.confirm('[' + nick + ']을(를) 가입 거절 하시겠습니까?',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.AwaiterReject({
                id: id,
                pid: $scope.targetDistributor._id
              }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                return DistributorInfoService.List($scope._query, function(data, defer) {
                  if (data.failure) return defer.reject(data.failure);
                  $scope.targetMemberTotal = data.total;
                  $scope.RenderList(data.totalPage, data.docs);
                  defer.resolve();
                });
              })
              .then(function () {
                return DistributorInfoService.Overview({}, function (data, defer) {
                  if(data.failure) return defer.reject(data.failure);
                  $scope.targetDistributor = data.distributor;
                  $scope.targetLevelInfo = data.levelInfo;
                  $scope.FindLevelInfo();
                  $scope.CalculatePercent();
                  defer.resolve();
                });
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('거절하였습니다.');
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.AwaiterRejectAll = function() {
      bootbox.confirm('모든 가입 신청자를 거절하시겠습니까?',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.AwaiterRejectAll({
                pid: $scope.targetDistributor._id
              }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                return DistributorInfoService.List($scope._query, function(data, defer) {
                  if (data.failure) return defer.reject(data.failure);
                  $scope.targetMemberTotal = data.total;
                  $scope.RenderList(data.totalPage, data.docs);
                  defer.resolve();
                });
              })
              .then(function () {
                return DistributorInfoService.Overview({}, function (data, defer) {
                  if(data.failure) return defer.reject(data.failure);
                  $scope.targetDistributor = data.distributor;
                  $scope.targetLevelInfo = data.levelInfo;
                  $scope.FindLevelInfo();
                  $scope.CalculatePercent();
                  defer.resolve();
                });
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('전부 거절하였습니다.');
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.HandOver = function(nick, id) {
      bootbox.confirm('[' + nick + ']에게 총판장을 인계하시겠습니까?',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.HandOver({
              id: id,
              pid: $scope.targetDistributor._id
            }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                return DistributorInfoService.List($scope._query, function(data, defer) {
                  if (data.failure) return defer.reject(data.failure);
                  $scope.targetMemberTotal = data.total;
                  $scope.RenderList(data.totalPage, data.docs);
                  defer.resolve();
                });
              })
              .then(function () {
                return DistributorInfoService.Overview({}, function (data, defer) {
                  if(data.failure) return defer.reject(data.failure);
                  $scope.targetDistributor = data.distributor;
                  $scope.targetLevelInfo = data.levelInfo;
                  $scope.FindLevelInfo();
                  $scope.CalculatePercent();
                  defer.resolve();
                });
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('인계하였습니다.', function () {
                  $state.reload();
                });
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.Expell = function(nick, id) {
      bootbox.confirm('[' + nick + ']을(를) 추방하시겠습니까?',
        function(ok) {
          if (ok) {
            $scope._StartLoading();
            DistributorInfoService.Expell({
              id: id,
              pid: $scope.targetDistributor._id
            }, function(data, defer) {
                if (data.failure) return defer.reject(data.failure);
                defer.resolve();
              })
              .then(function() {
                return DistributorInfoService.List($scope._query, function(data, defer) {
                  if (data.failure) return defer.reject(data.failure);
                  $scope.targetMemberTotal = data.total;
                  $scope.RenderList(data.totalPage, data.docs);
                  defer.resolve();
                });
              })
              .then(function () {
                return DistributorInfoService.Overview({}, function (data, defer) {
                  if(data.failure) return defer.reject(data.failure);
                  $scope.targetDistributor = data.distributor;
                  $scope.targetLevelInfo = data.levelInfo;
                  $scope.FindLevelInfo();
                  $scope.CalculatePercent();
                  defer.resolve();
                });
              })
              .then(function() {
                $scope._EndLoading();
                bootbox.alert('추방하였습니다.');
              })
              .catch(function(msg) {
                $scope._EndLoading();
                bootbox.alert(msg);
              });
          }
        });
    };

    $scope.FindLevelInfo = function() {
      for (var i = 0; i < $scope.targetLevelInfo.length; i++) {
        if ($scope.targetLevelInfo[i].name == $scope.targetDistributor.level) {
          $scope.targetCurLevelInfo = $scope.targetLevelInfo[i];
        } else if ($scope.targetLevelInfo[i].name == $scope.targetDistributor.level + 1) {
          $scope.targetNextLevelInfo = $scope.targetLevelInfo[i];
        }
      }
    };

    $scope.CalculatePercent = function() {
      $scope.targetPercent = ($scope.targetDistributor.contribution / $scope.targetNextLevelInfo.requirement) * 100;
    };

    $scope.Modify = function() {
      $scope.viewMode = 'UPDATE';
      $scope.targetJoinStyle = $scope.targetDistributor.joinStyle;
      $scope.targetMemo = $scope.targetDistributor.memo;
    };

    $scope.ModifyCancel = function() {
      $scope.viewMode = 'DISPLAY';
    };

    $scope.RenderList = function(pageCount, list) {
      $scope._list = list;
      $scope._pageCount = pageCount;
      $scope._pages = PublicFactory.Pagination($scope._query.page, $scope._pageCount, $scope._path, $scope._query);
    };

    $scope.ResetTarget = function() {

    };
    //***********************************************************************************************************
    //// Init Call Functions.
    $scope.FindLevelInfo();
    $scope.CalculatePercent();
    $scope.RenderList(init.data.totalPage, init.data.docs);

    $scope.List();
  }
]);
